<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\CourseContent; // mantido caso ainda queira avisos
use App\Models\Content;
use App\Models\CourseModule;
use App\Models\User;

class SampleCourseContentSeeder extends Seeder
{
    public function run(): void
    {
        // Pega primeiro professor e primeiro curso
        $teacher = User::where('role', 'teacher')->first();
        $course = Course::first();
        if (!$teacher || !$course) {
            return; // nada para semear
        }

        // Conteúdos genéricos usando o modelo Content (agora com validações obrigatórias)
        $text = Content::create([
            'user_id' => 4,
            'title' => 'Introdução ao Curso',
            'description' => 'Material de boas-vindas e visão geral.',
            'type' => 'PDF',
            'content' => "Bem-vindo! Aqui está uma visão geral inicial do curso.",
            'is_public' => true,
            'file_path' => 'contents/pdfs/6HhfmOpja80Bm8c1PTDEJOTAD2eK4xlI9tRdxZfh.pdf'
        ]);

        $link = Content::create([
            'user_id' => $teacher->id,
            'title' => 'Recurso Externo Importante',
            'description' => 'Artigo complementar para leitura.',
            'type' => 'link',
            'url' => 'https://example.com/artigo-importante',
            'is_public' => true,
        ]);

        $pdf = Content::create([
            'user_id' => $teacher->id,
            'title' => 'Guia do Curso (PDF)',
            'description' => 'Documento com regras e cronograma.',
            'type' => 'pdf',
            'file_path' => 'samples/guia.pdf', // certifique-se de criar/colocar o arquivo se quiser abrir
            'is_public' => false,
        ]);

        $video = Content::create([
            'user_id' => $teacher->id,
            'title' => 'Vídeo Aula 1',
            'description' => 'Primeira aula explicando conceitos-chave.',
            'type' => 'video',
            'url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'is_public' => true,
            'duration_minutes' => 5,
        ]);

        // Conteúdo de anúncio ainda usando CourseContent (mural de avisos)
        CourseContent::create([
            'course_id' => $course->id,
            'user_id' => $teacher->id,
            'type' => 'announcement',
            'title' => 'Primeiro Aviso',
            'body' => 'Bem-vindos ao curso! Este é um aviso de exemplo.'
        ]);

        // Anexa conteúdos ao primeiro módulo, se existir
        $module = CourseModule::where('course_id', $course->id)->first();
        if ($module) {
            $module->contents()->attach($text->id, ['order' => 1]);
            $module->contents()->attach($link->id, ['order' => 2]);
            $module->contents()->attach($pdf->id, ['order' => 3]);
            $module->contents()->attach($video->id, ['order' => 4]);
        }
    }
}
