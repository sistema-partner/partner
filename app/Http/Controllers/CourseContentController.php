<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

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
        ]);

        $course->contents()->create([
            'user_id' => $request->user()->id,
            'type' => 'announcement',
            'title' => $validatedData['title'] ?? null,
            'body' => $validatedData['body'],
        ]);

        return back()->with('success', 'Aviso postado com sucesso!');
    }
}