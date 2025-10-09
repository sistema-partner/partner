<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\EnrollmentLog;

class EnrollmentController extends Controller
{
    public function store(Request $request, Course $course)
    {
        if (!$request->user()->isStudent()) {
            abort(403, 'Apenas estudantes podem se inscrever em cursos.');
        }

        if (!$course->canEnroll()) {
            return back()->with('error', 'Este curso não está aceitando matrículas no momento.');
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