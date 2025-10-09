<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('course_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->comment('Autor do conteúdo (o teacher)')->constrained();

            // Este campo é a chave para o futuro: 'announcement', 'assignment', 'material', etc.
            $table->string('type')->default('announcement'); 

            $table->string('title')->nullable(); // Um título para o conteúdo
            $table->text('body')->nullable(); // O texto do aviso
            // Futuramente, podemos adicionar: due_date (data de entrega), file_path, etc.

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_contents');
    }
};
