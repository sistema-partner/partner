<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicCourseController extends Controller
{
    public function index()
    {
        $courses = Course::whereIn('status', ['planned', 'active'])
                            ->where('visibility', 'public')
                            ->with('teacher')
                            ->latest()
                            ->paginate(12);

        return Inertia::render('Courses/Explore', [
            'courses' => $courses,
        ]);
    }

    public function show(Request $request, Course $course)
    {
        // Carrega professor, avisos (contents) e módulos com conteúdos e autores
        $course->load([
            'teacher',
            'contents.author',
            'modules.contents.user'
        ]);
        
        $enrollmentStatus = $course->enrollments()
                                ->where('student_id', $request->user()->id)
                                ->first();

        return Inertia::render('Courses/PublicShow', [
            'course' => $course,
            'enrollmentStatus' => $enrollmentStatus,
        ]);
    }
}