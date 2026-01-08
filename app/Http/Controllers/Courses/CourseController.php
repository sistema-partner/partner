<?php

namespace App\Http\Controllers\Courses;
use App\Http\Controllers\Controller;


use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use App\Models\Tag;

class CourseController extends Controller
{
    public function index()
    {
        $courses = auth()->user()->taughtCourses()->latest()->get();
        return Inertia::render('Courses/Teacher/Index', ['courses' => $courses]);
    }

    public function create()
    {
        return Inertia::render('Courses/Teacher/Create', [
            'defaults' => [
                'visibility' => 'private',
                'enrollment_policy' => 'approval',
                'status' => 'planned',
            ],
        ]);
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
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $course = Course::create([
            'teacher_id' => auth()->id(),
            'title' => $request->title,
            'status' => 'planned',
            'visibility' => 'private',
            'code' => strtoupper(Str::random(8)),
        ]);

        return redirect()->route('teacher.courses.about', $course);
    }

    public function about(Course $course)
    {
        Gate::authorize('update', $course);
        $tags = Tag::orderBy('usage_count', 'desc')
                ->get(['id', 'name', 'type']);


        return Inertia::render('Courses/Teacher/Wizard/About', [
            'course' => $course->only([
                'id',
                'title',
                'description',
                'image_url',
            ]),
            'tags' => $tags
        ]);
    }

    public function updateAbout(Request $request, Course $course)
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image'       => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $validated['image_url'] = $path;
        }

        $course->update($validated);

        return redirect()
            ->route('teacher.courses.settings', $course)
            ->with('success', 'Informações do curso salvas');
    }

    protected function updateSettings(Request $request, Course $course)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:planned,active,ended,cancelled'],
            'visibility' => ['required', 'in:public,unlisted,private'],
            'enrollment_policy' => ['required', 'in:closed,auto_approve,manual_approval'],
            'accepts_enrollments' => ['required', 'boolean'],
            'max_students' => ['nullable', 'integer', 'min:1'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $course->update($validated);

        return redirect()
            ->route('teacher.courses.curriculum', $course)
            ->with('success', 'Configurações salvas');
    }


    public function update(Request $request, Course $course)
    {
        Gate::authorize('update', $course);

        $step = $request->input('step');

        switch ($step) {
            case 'about':
                return $this->updateAbout($request, $course);

            case 'settings':
                return $this->updateSettings($request, $course);

            default:
                abort(400, 'Invalid step');
        }
    }


    public function settings(Course $course)
    {
        Gate::authorize('update', $course);

        return Inertia::render('Courses/Teacher/Wizard/Settings', [
            'course' => [
                'id' => $course->id,
                'status' => $course->status,
                'visibility' => $course->visibility,
                'enrollment_policy' => $course->enrollment_policy,
                'accepts_enrollments' => $course->accepts_enrollments,
                'max_students' => $course->max_students,
                'start_date' => optional($course->start_date)->format('Y-m-d'),
                'end_date' => optional($course->end_date)->format('Y-m-d'),
            ],
        ]);
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
    public function destroy(Course $course)
    {
        // Lógica de exclusão (manter do seu código atual)
    }
}