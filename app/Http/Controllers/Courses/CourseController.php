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

    public function store(Request $request)
    {
        // Lógica de criação (manter do seu código atual)
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