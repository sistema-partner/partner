<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Content;
use App\Models\CourseContent;
use App\Models\Enrollment;

class CoreDemoSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'Professor Demo',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'status' => 'approved'
            ]
        );
        $student = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Aluno Demo',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'approved'
            ]
        );

        // Courses
        $courses = collect([
            ['title' => 'Laravel Básico', 'description' => 'Fundamentos do framework Laravel.'],
            ['title' => 'React para Iniciantes', 'description' => 'Introdução ao desenvolvimento com React.'],
            ['title' => 'Banco de Dados SQL', 'description' => 'Modelagem e consultas SQL.'],
        ])->map(function ($c) use ($teacher) {
            return Course::create([
                'teacher_id' => $teacher->id,
                'title' => $c['title'],
                'description' => $c['description'],
                'code' => Str::upper(Str::random(6)),
                'status' => 'active',
                'visibility' => 'public',
                'accepts_enrollments' => true,
            ]);
        });

        // Enroll student in first two courses (approved) and pending in third
        $courses->take(2)->each(function ($course) use ($student) {
            Enrollment::create([
                'course_id' => $course->id,
                'student_id' => $student->id,
                'status' => 'approved',
            ]);
        });
        Enrollment::create([
            'course_id' => $courses->last()->id,
            'student_id' => $student->id,
            'status' => 'pending',
        ]);

        // Modules & Contents
        $courses->each(function ($course, $ci) use ($teacher) {
            for ($i = 1; $i <= 3; $i++) {
                $module = CourseModule::create([
                    'course_id' => $course->id,
                    'title' => "Módulo $i",
                    'description' => "Conteúdos do módulo $i do curso {$course->title}",
                    'order' => $i,
                ]);

                // Generic shared contents
                $text = Content::create([
                    'user_id' => $teacher->id,
                    'title' => "Texto Aula $i",
                    'description' => 'Material textual explicativo.',
                    'type' => 'text',
                    'content' => "Conteúdo em texto para a aula $i do curso {$course->title}.",
                    'is_public' => true,
                ]);

                $link = Content::create([
                    'user_id' => $teacher->id,
                    'title' => "Link Útil $i",
                    'description' => 'Recurso externo para aprofundar.',
                    'type' => 'link',
                    'url' => 'https://example.com/recurso-' . $ci . '-' . $i,
                    'is_public' => true,
                ]);

                $pdf = Content::create([
                    'user_id' => $teacher->id,
                    'title' => "PDF Referência $i",
                    'description' => 'Documento complementar.',
                    'type' => 'pdf',
                    'file_path' => 'samples/guia.pdf',
                    'is_public' => false,
                ]);

                $video = Content::create([
                    'user_id' => $teacher->id,
                    'title' => "Vídeo Aula $i",
                    'description' => 'Aula em vídeo demonstrativa.',
                    'type' => 'video',
                    'url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'is_public' => true,
                    'duration_minutes' => 10 + $i,
                ]);

                // Attach to module
                $module->contents()->attach($text->id, ['order' => 1]);
                $module->contents()->attach($link->id, ['order' => 2]);
                $module->contents()->attach($pdf->id, ['order' => 3]);
                $module->contents()->attach($video->id, ['order' => 4]);

                // Module specific announcement
                CourseContent::create([
                    'course_id' => $course->id,
                    'user_id' => $teacher->id,
                    'type' => 'announcement',
                    'title' => "Aviso Módulo $i",
                    'body' => "Bem-vindos ao módulo $i do curso {$course->title}!",
                ]);
            }
        });
    }
}
