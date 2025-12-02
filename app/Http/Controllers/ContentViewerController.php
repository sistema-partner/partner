<?php

namespace App\Http\Controllers;

use App\Models\Content;
use App\Models\CourseModule;
use Illuminate\Http\Request;

class ContentViewerController extends Controller
{
    public function show(Request $request, $contentId)
    {
        // Busca conteúdo principal + módulos relacionados
        $content = Content::with(['user', 'modules.course'])->find($contentId);
        if (!$content) {
            return abort(404, 'Conteúdo não encontrado');
        }

        $user = $request->user();
        // Assume primeiro módulo para derivar curso (conteúdo pode estar em vários módulos)
        $module = $content->modules->first();
        $course = $module?->course;
        if (!$course) {
            return abort(404, 'Conteúdo sem curso associado');
        }

        $isTeacher = $course->teacher_id === $user->id;
        $isEnrolled = $course->enrollments()->where('student_id', $user->id)->where('status', 'approved')->exists();
        $isAuthor = $content->user_id === $user->id;

        if (!($isTeacher || $isEnrolled || $isAuthor || $content->is_public)) {
            return abort(403, 'Sem permissão para visualizar este conteúdo');
        }

        return inertia('Contents/Show', [
            'auth' => ['user' => $user],
            'content' => $content,
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'modules_count' => $course->modules_count,
                'lessons_count' => $course->lessons_count,
            ],
        ]);
    }
}
