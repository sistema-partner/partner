<?php

namespace App\Http\Controllers\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseModule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class CourseModuleController extends Controller
{
    public function store(Request $request, Course $course)
    {
        Gate::authorize('update', $course);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $order = $course->modules()->max('order') + 1;

        $module = $course->modules()->create([
            'title' => $data['title'],
            'slug' => Str::slug($data['title']) . '-' . Str::random(6),
            'order' => $order,
        ]);

        return response()->json($module, 201);
    }

    public function update(Request $request, CourseModule $module)
    {
        Gate::authorize('update', $module->course);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_public' => ['boolean'],
            'is_required' => ['boolean'],
            'estimated_duration_minutes' => ['nullable', 'integer', 'min:1'],
        ]);

        $module->update($data);

        return response()->json($module);
    }

    public function destroy(CourseModule $module)
    {
        Gate::authorize('update', $module->course);

        $module->delete();

        return response()->noContent();
    }

    public function reorder(Request $request, Course $course)
    {
        Gate::authorize('update', $course);

        $data = $request->validate([
            'modules' => ['required', 'array'],
            'modules.*.id' => ['required', 'exists:course_modules,id'],
            'modules.*.order' => ['required', 'integer'],
        ]);

        foreach ($data['modules'] as $item) {
            CourseModule::where('id', $item['id'])
                ->where('course_id', $course->id)
                ->update(['order' => $item['order']]);
        }

        return response()->json(['status' => 'ok']);
    }
}