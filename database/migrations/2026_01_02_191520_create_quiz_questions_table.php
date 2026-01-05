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
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id(); // auto incrementável

            // Chave estrangeira para a tabela module_units
            // O método constrained() assume que a tabela se chama 'module_units'
            $table->foreignId('unit_id')->constrained('module_units')->onDelete('cascade');

            // Enum para o tipo da questão
            $table->enum('type', ['multiple_choice', 'open']);

            // Texto da questão
            $table->text('question');

            // JSON para opções (anulável)
            $table->json('options')->nullable();

            // Resposta correta (string e anulável)
            $table->string('correct_answer')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};