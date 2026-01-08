<?php

namespace App\Http\Controllers\Courses;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\CourseModule;
use Illuminate\Support\Facades\Gate;
use App\Models\ModuleUnit;

class ModuleUnitController extends Controller
{
    public function store(Request $request, CourseModule $module)
    {
        Gate::authorize('update', $module->course);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:lesson,quiz,project,code_exercise'],
        ]);

        $order = $module->units()->max('order') + 1;

        $unit = $module->units()->create([
            'title' => $data['title'],
            'type' => $data['type'],
            'order' => $order,
        ]);

        return response()->json($unit, 201);
    }

    public function update(Request $request, ModuleUnit $unit)
    {
        Gate::authorize('update', $unit->module->course);

        $data = $request->validate([
            'title' => ['string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_optional' => ['boolean'],
        ]);

        $unit->update($data);

        return response()->json($unit);
    }

    public function destroy(ModuleUnit $unit)
    {
        Gate::authorize('update', $unit->module->course);

        $unit->delete();

        return response()->noContent();
    }

    public function reorder(Request $request, CourseModule $module)
    {
        Gate::authorize('update', $module->course);

        $data = $request->validate([
            'units' => ['required', 'array'],
            'units.*.id' => ['required', 'exists:module_units,id'],
            'units.*.order' => ['required', 'integer'],
        ]);

        foreach ($data['units'] as $item) {
            ModuleUnit::where('id', $item['id'])
                ->where('course_module_id', $module->id)
                ->update(['order' => $item['order']]);
        }

        return response()->json(['status' => 'ok']);
    }
}