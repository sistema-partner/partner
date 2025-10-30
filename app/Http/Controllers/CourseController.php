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
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => 'required|date|after_or_equal:start_date',
            'image' => 'nullable|image|max:2048',
            'cover' => 'nullable|image|max:4096',
            'modules' => 'nullable|array',
            'modules.*.title' => 'required_with:modules|string|max:255',
            'modules.*.description' => 'nullable|string',
            'modules.*.contents' => 'nullable|array',
            'modules.*.contents.*.title' => 'required_with:modules.*.contents|string|max:255',
            'modules.*.contents.*.type' => 'required_with:modules.*.contents|string|in:video,pdf,document,quiz,assignment,link,text',
            'modules.*.contents.*.is_public' => 'nullable|boolean',
            'modules.*.contents.*.file' => 'nullable|file|max:51200', // 50MB
            'modules.*.contents.*.url' => 'nullable|url',
            'modules.*.contents.*.content' => 'nullable|string',
            'modules.*.contents.*.id' => 'nullable|integer|exists:contents,id',
        ], [
            'start_date.after_or_equal' => 'A data de início deve ser hoje ou uma data futura.'
        ]);

        do {
            $code = Str::upper(Str::random(6));
        } while (Course::where('code', $code)->exists());

        $validatedData['code'] = $code;

        // Uploads
        if ($request->hasFile('image')) {
            $validatedData['image_path'] = $request->file('image')->store('courses/images', 'public');
        }
        if ($request->hasFile('cover')) {
            $validatedData['cover_path'] = $request->file('cover')->store('courses/covers', 'public');
        }

        $course = $request->user()->taughtCourses()->create($validatedData);

        // Persistir módulos e conteúdos vinculados, se enviados
        if (!empty($validatedData['modules'])) {
            foreach ($validatedData['modules'] as $order => $moduleData) {
                $module = $course->modules()->create([
                    'title' => $moduleData['title'] ?? 'Módulo',
                    'description' => $moduleData['description'] ?? null,
                    'order' => $order,
                    'is_public' => true,
                ]);

                if (!empty($moduleData['contents'])) {
                    foreach ($moduleData['contents'] as $contentOrder => $contentData) {
                        // Caso seja um conteúdo existente (público)
                        if (!empty($contentData['id'])) {
                            $module->contents()->attach($contentData['id'], ['order' => $contentOrder]);
                            continue;
                        }

                        // Criar novo conteúdo
                        $newContentPayload = [
                            'user_id' => $request->user()->id,
                            'title' => $contentData['title'],
                            'description' => $contentData['description'] ?? null,
                            'type' => $contentData['type'],
                            'is_public' => !empty($contentData['is_public']),
                        ];

                        // Processar arquivo conforme tipo
                        if (!empty($contentData['file']) && $contentData['file'] instanceof \Illuminate\Http\UploadedFile) {
                            $subFolder = match ($contentData['type']) {
                                'video' => 'videos',
                                'pdf' => 'pdfs',
                                'document' => 'documents',
                                'quiz' => 'quizzes',
                                'assignment' => 'assignments',
                                default => 'others'
                            };
                            $stored = $contentData['file']->store('contents/' . $subFolder, 'public');
                            $newContentPayload['file_path'] = $stored;
                        }

                        // URL para links
                        if ($contentData['type'] === 'link' && !empty($contentData['url'])) {
                            $newContentPayload['url'] = $contentData['url'];
                        }

                        // Texto para tipo text
                        if ($contentData['type'] === 'text' && !empty($contentData['content'])) {
                            $newContentPayload['content'] = $contentData['content'];
                        }

                        $createdContent = \App\Models\Content::create($newContentPayload);
                        $module->contents()->attach($createdContent->id, ['order' => $contentOrder]);
                    }
                }
            }
        }

        return Redirect::route('dashboard')->with('success', 'Curso criado com sucesso!');
    }
    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $user = auth()->user();

        if ($course->teacher_id === $user->id) {
            // Carrega matrículas, avisos (contents) e agora módulos com seus conteúdos
            $course->load([
                'enrollments.student',
                'contents.author', // avisos (CourseContent)
                'modules.contents.user' // módulos e conteúdos reutilizáveis/não-anúncios
            ]);
            return Inertia::render('Courses/Show', [
                'course' => $course,
            ]);
        }

        $isEnrolledAndApproved = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'approved')
            ->exists();

        if ($isEnrolledAndApproved) {
            $course->load([
                'teacher',
                'contents.author',
                'modules.contents.user'
            ]);

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
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => ['required', Rule::in(['active', 'planned', 'ended', 'cancelled'])],
            'image' => 'nullable|image|max:2048',
            'cover' => 'nullable|image|max:4096',
            'remove_image' => 'sometimes|boolean',
            'remove_cover' => 'sometimes|boolean',
        ], [
            'start_date.after_or_equal' => 'A data de início deve ser hoje ou futura.'
        ]);

        if ($request->boolean('remove_image')) {
            $validatedData['image_path'] = null;
        } elseif ($request->hasFile('image')) {
            $validatedData['image_path'] = $request->file('image')->store('courses/images', 'public');
        }
        if ($request->boolean('remove_cover')) {
            $validatedData['cover_path'] = null;
        } elseif ($request->hasFile('cover')) {
            $validatedData['cover_path'] = $request->file('cover')->store('courses/covers', 'public');
        }

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
