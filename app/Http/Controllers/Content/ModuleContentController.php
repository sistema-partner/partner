<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;


use App\Models\CourseModule;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class ModuleContentController extends Controller
{
    public function store(Request $request, CourseModule $module)
    {
        if ($module->course->teacher_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:video,pdf,document,link,text',
            'url' => 'nullable|required_if:type,link|url',
            'content' => 'nullable|required_if:type,text|string',
            'file' => 'nullable|required_if:type,video,pdf,document|file|max:51200',
        ]);

        $data = [
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'type' => $request->type,
            'is_public' => true,
        ];

        if ($request->type === 'link') {
            $data['url'] = $request->url;
        } elseif ($request->type === 'text') {
            $data['content'] = $request->input('content');
        } elseif ($request->hasFile('file')) {
            $path = $request->file('file')->store('contents/' . $request->type . 's', 'public');
            $data['file_path'] = $path;
        }

        $content = Content::create($data);
        
        $maxOrder = $module->contents()->max('module_content.order') ?? 0;
        $module->contents()->attach($content->id, ['order' => $maxOrder + 1]);

        return Redirect::back()->with('success', 'Conteúdo adicionado!');
    }

    public function update(Request $request, Content $content)
    {
        if ($content->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|url',
            'content' => 'nullable|string',
        ]);

        $content->update($data);

        return Redirect::back()->with('success', 'Conteúdo atualizado!');
    }

    public function destroy(Request $request, CourseModule $module, Content $content)
    {
        if ($module->course->teacher_id !== $request->user()->id) {
            abort(403);
        }

        $module->contents()->detach($content->id);

        if ($content->modules()->count() === 0) {
            if ($content->file_path) {
                Storage::disk('public')->delete($content->file_path);
            }
            $content->delete();
        }

        return Redirect::back()->with('success', 'Conteúdo removido do módulo!');
    }
}