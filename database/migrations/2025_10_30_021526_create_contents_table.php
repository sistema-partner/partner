<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->comment('Professor criador');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['video', 'pdf', 'document', 'quiz', 'assignment', 'link', 'text']);
            $table->string('file_path')->nullable()->comment('Para arquivos uploadados');
            $table->string('url')->nullable()->comment('Para links externos');
            $table->text('content')->nullable()->comment('Para conteúdo em texto');
            $table->integer('duration_minutes')->nullable()->comment('Duração em minutos');
            $table->boolean('is_public')->default(false);
            $table->integer('download_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->timestamps();
            
            $table->index(['user_id', 'is_public']);
            $table->index(['type', 'is_public']);
        });

        // Tabela pivô para conteúdos em módulos
        Schema::create('module_content', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('course_modules')->onDelete('cascade');
            $table->foreignId('content_id')->constrained()->onDelete('cascade');
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->unique(['module_id', 'content_id']);
            $table->index(['module_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_content');
        Schema::dropIfExists('contents');
    }
};