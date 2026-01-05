<?php

namespace App\Http\Controllers\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseModule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CourseModuleController extends Controller
{
    /**
     * Cria um novo módulo dentro de um curso
     */

    public function store(Request $request, Course $course)
    {
        Gate::authorize('manage', $course);

        $course->modules()->create([
            'title' => $request->title,
            'order' => $course->modules()->count() + 1,
        ]);

        return back();
    }

    /**
     * Atualiza um módulo
     */
    public function update(Request $request, CourseModule $module)
    {
        Gate::authorize('update', $module->course);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order' => ['nullable', 'integer', 'min:1'],
        ]);

        $module->update($data);

        return redirect()->back()->with('success', 'Módulo atualizado com sucesso!');
    }

    /**
     * Remove um módulo
     */
    public function destroy(CourseModule $module)
    {
        Gate::authorize('update', $module->course);

        $module->delete();

        return redirect()->back()->with('success', 'Módulo removido com sucesso!');
    }
}
