<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\EnrollmentRequestNotification;
use App\Models\EnrollmentLog;

class EnrollmentController extends Controller
{
    public function enrollByCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:courses,code'
        ], [
            'code.exists' => 'Código de curso inválido.'
        ]);

        $course = Course::where('code', $request->code)->first();

        if (!$request->user()->isStudent()) {
            abort(403, 'Apenas estudantes podem se inscrever em cursos.');
        }

        if (!$course->canEnroll()) {
            return back()->with('error', 'Este curso não está aceitando matrículas (status inválido ou limite atingido).');
        }

        $existing = Enrollment::where('student_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Você já está matriculado ou possui solicitação pendente.');
        }

        // Cria matrícula já aprovada (sem necessidade de professor)
        $enrollment = Enrollment::create([
            'student_id' => $request->user()->id,
            'course_id' => $course->id,
            'status' => 'approved',
            'requested_at' => now(),
            'approved_at' => now(),
            'approved_by' => $course->teacher_id
        ]);

        EnrollmentLog::create([
            'enrollment_id' => $enrollment->id,
            'action' => 'approved', // usar ação existente na enum
            'performed_by' => $request->user()->id,
            'reason' => 'via_code'
        ]);

        return back()->with('success', 'Matrícula realizada com sucesso através do código!');
    }
    public function store(Request $request, Course $course)
    {
        if (!$request->user()->isStudent()) {
            abort(403, 'Apenas estudantes podem se inscrever em cursos.');
        }

        if (!$course->canEnroll()) {
            return back()->with('error', 'Este curso não está aceitando matrículas (status inválido ou limite atingido).');
        }

        $existingEnrollment = Enrollment::where('student_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($existingEnrollment) {
            return back()->with('error', 'Você já solicitou ou está matriculado neste curso.');
        }

        $enrollment = Enrollment::create([
            'student_id' => $request->user()->id,
            'course_id' => $course->id,
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        EnrollmentLog::create([
            'enrollment_id' => $enrollment->id,
            'action' => 'requested',
            'performed_by' => $request->user()->id,
        ]);

        // 🔔 VERIFIQUE SE ESTÁ CHEGANDO AQUI
        \Log::info('Tentando enviar notificação para o professor', [
            'teacher_id' => $course->teacher->id,
            'teacher_name' => $course->teacher->name,
            'enrollment_id' => $enrollment->id
        ]);

        try {
            $course->teacher->notify(new \App\Notifications\EnrollmentRequestNotification($enrollment));
            \Log::info('Notificação enviada com sucesso');
        } catch (\Exception $e) {
            \Log::error('Erro ao enviar notificação: ' . $e->getMessage());
        }

        return back()->with('success', 'Solicitação de matrícula enviada com sucesso!');
    }

    public function approve(Request $request, Enrollment $enrollment)
    {
        if ($enrollment->course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $enrollment->approve(Auth::id());

        return back()->with('success', 'Matrícula aprovada com sucesso.');
    }

    /**
     * Rejeita uma solicitação de matrícula.
     */
    public function reject(Request $request, Enrollment $enrollment)
    {
        if ($enrollment->course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate(['reason' => 'nullable|string|max:255']);

        $enrollment->reject(Auth::id(), $data['reason'] ?? null);

        return back()->with('success', 'Matrícula rejeitada.');
    }

    public function destroy(Request $request, Enrollment $enrollment)
    {
        $user = $request->user();

        if ($user->id !== $enrollment->student_id && !$user->isAdmin()) {
            abort(403);
        }

        if (!$enrollment->canBeCancelled()) {
            return back()->with('error', 'O prazo para cancelamento desta matrícula já expirou.');
        }

        $data = $request->validate(['reason' => 'nullable|string|max:255']);

        $enrollment->cancel($user->id, $data['reason'] ?? 'Cancelado pelo usuário.');

        return back()->with('success', 'Matrícula cancelada com sucesso.');
    }
}