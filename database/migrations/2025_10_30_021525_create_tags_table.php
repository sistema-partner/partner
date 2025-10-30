<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->enum('type', ['skill', 'tool', 'topic', 'level', 'audience'])->default('topic');
            $table->integer('usage_count')->default(0);
            $table->timestamps();

            $table->index(['type', 'usage_count']);
        });

        // Tabela polimórfica para tags (cursos e conteúdos)
        Schema::create('taggables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->morphs('taggable'); // taggable_id, taggable_type (Course, Content)
            $table->float('weight')->default(1.0)->comment('Relevância da tag');
            $table->string('context')->nullable()->comment('Contexto opcional');
            $table->timestamps();
            // Index on (taggable_type, taggable_id) is already created by morphs(), no need to duplicate
            $table->unique(['tag_id', 'taggable_id', 'taggable_type'], 'unique_tagging');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taggables');
        Schema::dropIfExists('tags');
    }
};