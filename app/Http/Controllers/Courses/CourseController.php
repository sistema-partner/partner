<?php

namespace App\Http\Controllers\Courses;
use App\Http\Controllers\Controller;


use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;
use App\Models\ModuleUnit;
use App\Models\CourseModule;

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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'tags' => ['nullable', 'array'],
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $validated['image_url'] = $path;
        }

        $course->update($validated);

        // Sincronizar tags - extrair apenas IDs se forem objetos
        $tags = $request->input('tags', []);
        $tagIds = [];

        if (is_array($tags)) {
            foreach ($tags as $tag) {
                if (is_array($tag) && isset($tag['id'])) {
                    $tagIds[] = $tag['id'];
                } elseif (is_numeric($tag)) {
                    $tagIds[] = $tag;
                }
            }
        }

        if (!empty($tagIds)) {
            $course->tags()->sync($tagIds);
        } else {
            $course->tags()->detach();
        }

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

    public function updateCurriculum(Request $request, Course $course)
    {
        Gate::authorize('update', $course);

        $data = $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'nullable|integer',
            'modules.*.title' => 'required|string|max:255',
            'modules.*.description' => 'nullable|string',
            'modules.*.order' => 'required|integer',

            'modules.*.units' => 'array',
            'modules.*.units.*.id' => 'nullable|integer',
            'modules.*.units.*.title' => 'required|string|max:255',
            'modules.*.units.*.type' => 'required|in:lesson,quiz,project,code_exercise',
            'modules.*.units.*.order' => 'required|integer',
            'modules.*.units.*.is_optional' => 'boolean',
        ]);

        DB::transaction(function () use ($data, $course) {
            $moduleIds = [];

            foreach ($data['modules'] as $moduleData) {
                // Valida se o módulo pertence ao curso
                if (!empty($moduleData['id'])) {
                    $existingModule = CourseModule::where('id', $moduleData['id'])
                        ->where('course_id', $course->id)
                        ->first();

                    if (!$existingModule) {
                        abort(403, 'Unauthorized module');
                    }
                }

                $module = CourseModule::updateOrCreate(
                    [
                        'id' => $moduleData['id'] ?? null,
                    ],
                    [
                        'course_id' => $course->id,
                        'title' => $moduleData['title'],
                        'description' => $moduleData['description'] ?? null,
                    ]
                );

                $moduleIds[] = $module->id;

                $unitIds = [];

                foreach ($moduleData['units'] ?? [] as $unitData) {
                    // Valida se a unidade pertence ao módulo
                    if (!empty($unitData['id'])) {
                        $existingUnit = ModuleUnit::where('id', $unitData['id'])
                            ->where('course_module_id', $module->id)
                            ->first();

                        if (!$existingUnit) {
                            abort(403, 'Unauthorized unit');
                        }
                    }

                    $unit = ModuleUnit::updateOrCreate(
                        [
                            'id' => $unitData['id'] ?? null,
                        ],
                        [
                            'course_module_id' => $module->id,
                            'title' => $unitData['title'],
                            'type' => $unitData['type'],
                            'order' => $unitData['order'],
                            'is_optional' => $unitData['is_optional'] ?? false,
                        ]
                    );

                    $unitIds[] = $unit->id;
                }

                // remove units deletadas
                ModuleUnit::where('course_module_id', $module->id)
                    ->whereNotIn('id', $unitIds)
                    ->delete();
            }

            // remove modules deletados
            CourseModule::where('course_id', $course->id)
                ->whereNotIn('id', $moduleIds)
                ->delete();
        });

        return back();
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

    public function curriculum(Course $course)
    {
        Gate::authorize('update', $course);
        $tags = Tag::orderBy('usage_count', 'desc')
            ->get(['id', 'name', 'type']);

        $modules = $course->modules()
            ->with('units')
            ->orderBy('order')
            ->get()
            ->map(fn($module) => [
                'id' => $module->id,
                'title' => $module->title,
                'description' => $module->description,
                'order' => $module->order,
                'units' => $module->units->map(fn($unit) => [
                    'id' => $unit->id,
                    'title' => $unit->title,
                    'type' => $unit->type,
                    'order' => $unit->order,
                    'is_optional' => $unit->is_optional,
                ])->toArray(),
            ])
            ->toArray();

        return Inertia::render('Courses/Teacher/Wizard/Curriculum', [
            'course' => array_merge(
                $course->only([
                    'id',
                    'title',
                    'description',
                    'image_url',
                ]),
                ['modules' => $modules]
            ),
            'tags' => $tags
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