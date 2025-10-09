<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $courses = auth()->user()->taughtCourses()->latest()->get();

        // Renderiza o componente React 'Courses/Index.jsx'
        // e passa a lista de cursos como uma "prop" chamada 'courses'.
        return Inertia::render('Courses/index', [
            'courses' => $courses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Courses/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        do {
            $code = Str::upper(Str::random(6));
        } while (Course::where('code', $code)->exists()); 

        $validatedData['code'] = $code;

        $request->user()->taughtCourses()->create($validatedData);

        return Redirect::route('dashboard')->with('success', 'Curso criado com sucesso!');
    }
    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $user = auth()->user();

        if ($course->teacher_id === $user->id) {
            $course->load(['enrollments.student', 'contents.author']);
            return Inertia::render('Courses/Show', [
                'course' => $course,
            ]);
        }

        $isEnrolledAndApproved = $user->enrollments()
                                      ->where('course_id', $course->id)
                                      ->where('status', 'approved')
                                      ->exists();
        
        if ($isEnrolledAndApproved) {
            $course->load(['teacher', 'contents.author']);

            return Inertia::render('Courses/PublicShow', [
                'course' => $course,
                'enrollmentStatus' => $user->enrollments()->where('course_id', $course->id)->first(),
            ]);
        }

        abort(403, 'Você não tem permissão para acessar este curso.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403, 'Acesso não autorizado.');
        }

        return Inertia::render('Courses/Edit', [
            'course' => $course,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403, 'Acesso não autorizado.');
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'code' => ['required', 'string', 'max:20', Rule::unique('courses')->ignore($course->id)],
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => ['required', Rule::in(['active', 'planned', 'ended', 'cancelled'])],
        ]);

        $course->update($validatedData);

        return Redirect::route('dashboard')->with('success', 'Curso atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
     public function destroy(Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403, 'Acesso não autorizado.');
        }

        $course->delete();

        return Redirect::route('dashboard')->with('success', 'Curso excluído com sucesso!');
    }
}
