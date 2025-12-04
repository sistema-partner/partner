<?php

namespace App\Http\Controllers\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseShowController extends Controller
{
    public function teacherView(Course $course)
    {
        $course->load([
            'teacher',
            'enrollments.student',
            'contents.author',
            'modules.contents.user',
            'tags'
        ]);

        $contentTags = Tag::where('type', 'topic')->get()->map(fn($tag) => [
            'value' => $tag->name, 'label' => $tag->name
        ]);

        return Inertia::render('Courses/Teacher/Show', [
            'course' => $course,
            'contentTags' => $contentTags,
        ]);
    }

    public function studentView(Request $request, Course $course)
    {
        $user = $request->user();
        
        $isEnrolledAndApproved = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'approved')
            ->exists();

        if (!$isEnrolledAndApproved) {
            abort(403, 'Você não tem permissão para acessar este curso.');
        }

        $course->load([
            'teacher',
            'contents.author',
            'modules.contents.user'
        ]);

        return Inertia::render('Courses/Student/Show', [
            'course' => $course,
            'enrollmentStatus' => $user->enrollments()->where('course_id', $course->id)->first(),
        ]);
    }

    public function publicView(Request $request, Course $course)
    {
        // Para visitantes/não matriculados (público)
        if ($course->visibility !== 'public') {
            abort(404);
        }

        $course->load([
            'teacher',
            'contents.author',
            'modules.contents.user'
        ]);
        
        $enrollmentStatus = $request->user() ? 
            $course->enrollments()->where('student_id', $request->user()->id)->first() : 
            null;

        return Inertia::render('Courses/Public/Show', [
            'course' => $course,
            'enrollmentStatus' => $enrollmentStatus,
        ]);
    }
}