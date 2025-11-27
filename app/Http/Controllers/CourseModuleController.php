<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseModule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CourseModuleController extends Controller
{
    public function store(Request $request, Course $course)
    {
        if ($course->teacher_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $maxOrder = $course->modules()->max('order') ?? 0;

        $course->modules()->create([
            'title' => $request->title,
            'description' => $request->description,
            'order' => $maxOrder + 1,
            'is_public' => true,
        ]);

        return Redirect::back()->with('success', 'Módulo criado com sucesso!');
    }

    public function update(Request $request, CourseModule $module)
    {
        if ($module->course->teacher_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $module->update($validated);

        return Redirect::back()->with('success', 'Módulo atualizado!');
    }

    public function destroy(Request $request, CourseModule $module)
    {
        if ($module->course->teacher_id !== $request->user()->id) {
            abort(403);
        }

        $module->delete();

        return Redirect::back()->with('success', 'Módulo removido!');
    }
}