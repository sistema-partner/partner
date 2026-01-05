<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseModule;
use Illuminate\Support\Facades\Gate;
use App\Models\ModuleUnit;

class ModuleUnitController extends Controller
{
    //
    public function store(Request $request, CourseModule $module)
{
    Gate::authorize('manage', $module->course);
    
    $module->units()->create([
        'title' => $request->title,
        'order' => $module->units()->count() + 1,
    ]);
}

    public function update(Request $request, ModuleUnit $unit)
    {
        Gate::authorize('manage', $unit->module->course);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'order' => ['nullable', 'integer', 'min:1'],
        ]);

        $unit->update($data);

        return redirect()->back()->with('success', 'Unidade atualizada com sucesso!');
    }

    public function destroy(ModuleUnit $unit)
    {
        Gate::authorize('manage', $unit->module->course);

        $unit->delete();

        return redirect()->back()->with('success', 'Unidade removida com sucesso!');
    }
}