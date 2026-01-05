<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Content;
use App\Models\Enrollment;
use App\Models\ModuleUnit;
use App\Models\UnitContent;

class CoreDemoSeeder extends Seeder
{
    public function run(): void
    {
        /* =====================================================
         | USERS
         ===================================================== */
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'Professor Demo',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'status' => 'approved',
            ]
        );

        $student = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Aluno Demo',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'approved',
            ]
        );

        /* =====================================================
         | COURSES
         ===================================================== */
        $courses = collect([
            [
                'title' => 'Laravel Básico',
                'description' => 'Fundamentos do framework Laravel.',
                'image_url' => 'https://edukits.com.br/wp-content/uploads/2025/08/Diseno-sin-titulo-4.png',
            ],
            [
                'title' => 'React para Iniciantes',
                'description' => 'Introdução ao desenvolvimento com React.',
                'image_url' => 'https://devsagaz.com.br/content/images/2023/05/Ekran-Resmi-2019-11-18-18.08.13.png',
            ],
            [
                'title' => 'Banco de Dados SQL',
                'description' => 'Modelagem e consultas SQL.',
                'image_url' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-mEvAE4fw8cnGg9sWw-_nT_DuGfrpuRKSMw&s',
            ],
        ])->map(fn ($c) => Course::create([
            'teacher_id' => $teacher->id,
            'title' => $c['title'],
            'description' => $c['description'],
            'code' => Str::upper(Str::random(6)),
            'status' => 'active',
            'visibility' => 'public',
            'accepts_enrollments' => true,
            'image_url' => $c['image_url'],
        ]));

        /* =====================================================
         | ENROLLMENTS
         ===================================================== */
        $courses->take(2)->each(fn ($course) =>
            Enrollment::create([
                'course_id' => $course->id,
                'student_id' => $student->id,
                'status' => 'approved',
                'source' => 'self_enroll',
                'requested_at' => now(),
                'approved_at' => now(),
            ])
        );

        Enrollment::create([
            'course_id' => $courses->last()->id,
            'student_id' => $student->id,
            'status' => 'pending',
            'source' => 'self_enroll',
            'requested_at' => now(),
        ]);

        /* =====================================================
         | MODULES, UNITS & CONTENTS
         ===================================================== */
        $courses->each(function ($course, $ci) use ($teacher) {

            for ($i = 1; $i <= 3; $i++) {

                $module = CourseModule::create([
                    'course_id' => $course->id,
                    'title' => "Módulo $i",
                    'slug' => Str::slug("{$course->title}-modulo-$i-{$course->id}"),
                    'description' => "Conteúdos do módulo $i do curso {$course->title}",
                    'is_public' => true,
                    'is_required' => true,
                    'estimated_duration_minutes' => 30 + ($i * 10),
                ]);

                for ($u = 1; $u <= 2; $u++) {

                    $unit = ModuleUnit::create([
                        'module_id' => $module->id,
                        'title' => "Unidade $u do Módulo $i",
                        'description' => "Materiais da unidade $u do módulo $i",
                        'type' => 'lesson',
                        'order' => $u,
                        'is_optional' => false,
                    ]);

                    /* -------------------------
                     | CONTENTS (reutilizáveis)
                     ------------------------- */

                    $text = Content::create([
                        'user_id' => $teacher->id,
                        'type' => 'text',
                        'title' => "Texto Aula $i.$u",
                        'content' => "Conteúdo textual da unidade $u do módulo $i.",
                        'is_public' => true,
                    ]);

                    $link = Content::create([
                        'user_id' => $teacher->id,
                        'type' => 'link',
                        'title' => "Link Útil $i.$u",
                        'url' => "https://example.com/recurso-$ci-$i-$u",
                        'is_public' => true,
                    ]);

                    $pdf = Content::create([
                        'user_id' => $teacher->id,
                        'type' => 'pdf',
                        'title' => "PDF Referência $i.$u",
                        'file_path' => 'samples/guia.pdf',
                        'is_public' => false,
                    ]);

                    $video = Content::create([
                        'user_id' => $teacher->id,
                        'type' => 'video',
                        'title' => "Vídeo Aula $i.$u",
                        'url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        'duration_minutes' => 10 + $i + $u,
                        'is_public' => true,
                    ]);

                    /* -------------------------
                     | UNIT CONTENTS (pivot)
                     ------------------------- */

                    UnitContent::insert([
                        ['unit_id' => $unit->id, 'content_id' => $text->id,  'order' => 1],
                        ['unit_id' => $unit->id, 'content_id' => $link->id,  'order' => 2],
                        ['unit_id' => $unit->id, 'content_id' => $pdf->id,   'order' => 3],
                        ['unit_id' => $unit->id, 'content_id' => $video->id, 'order' => 4],
                    ]);
                }
            }
        });
    }
}
