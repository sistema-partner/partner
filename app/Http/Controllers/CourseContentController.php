<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseContentController extends Controller
{
    public function store(Request $request, Course $course)
    {
        if ($course->teacher_id !== $request->user()->id) {
            abort(403);
        }

        $validatedData = $request->validate([
            'body' => 'required|string',
            'title' => 'nullable|string|max:255',
            'tags' => 'nullable|array'
        ]);

        $content = $course->contents()->create([
            'user_id' => $request->user()->id,
            'type' => 'announcement',
            'title' => $validatedData['title'] ?? null,
            'body' => $validatedData['body'],
        ]);

        if ($request->has('tags')) {
            $tagNames = collect($request->input('tags'))->pluck('value');
            $tagIds = [];

            foreach ($tagNames as $name) {
                $tag = Tag::firstOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name, 'type' => 'topic'] 
                );
                $tagIds[] = $tag->id;
            }
            
            $content->tags()->sync($tagIds);
        }

        return back()->with('success', 'Aviso postado com sucesso!');
    }
}