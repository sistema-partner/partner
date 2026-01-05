<?php

namespace App\Http\Controllers\Courses;
use App\Http\Controllers\Controller;


use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class CourseController extends Controller
{
    public function index()
    {
        $courses = auth()->user()->taughtCourses()->latest()->get();
        return Inertia::render('Courses/Teacher/Index', ['courses' => $courses]);
    }

    public function create()
    {
        return Inertia::render('Courses/Teacher/Create');
    }

    private function resolveStatus(array $data): string
    {
        if (!empty($data['start_date'])) {
            return now()->lt($data['start_date'])
                ? 'planned'
                : 'active';
        }

        return 'active';
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],

            'visibility' => ['required', 'in:public,private,unlisted'],

            'start_date' => ['nullable', 'date'],
            'enrollment_policy' => ['required', 'in:closed,auto,approval'],

            'enrollment_methods' => ['nullable', 'array'],
            'enrollment_methods.*' => ['in:link,code'],
        ]);

        $course = Course::create([
            'teacher_id' => auth()->id(),
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'visibility' => $data['visibility'],
            'start_date' => $data['start_date'] ?? null,
            'enrollment_policy' => $data['enrollment_policy'],
            'status' => $this->resolveStatus($data),
        ]);

        if (!empty($data['tags'])) {
            $course->syncTags($data['tags']); // se usar spatie/tags
        }

        return Redirect::route('teacher.courses.edit', $course)
            ->with('success', 'Curso criado com sucesso!');
    }


    public function show(Course $course)
    {
        // Redireciona para o CourseShowController
        return app(CourseShowController::class)->teacherView($course);
    }

    public function edit(Course $course)
    {
        // Lógica de edição (manter do seu código atual)
    }

    public function update(Request $request, Course $course)
    {
        // Lógica de atualização (manter do seu código atual)
    }

    public function destroy(Course $course)
    {
        // Lógica de exclusão (manter do seu código atual)
    }
}