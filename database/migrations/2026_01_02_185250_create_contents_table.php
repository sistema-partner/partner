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
        Schema::create('contents', function (Blueprint $table) {
            $table->id();

            // autoria
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // metadados
            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('type', [
                'video',
                'pdf',
                'document',
                'link',
                'text'
            ]);

            // dados específicos
            $table->string('file_path')->nullable(); // pdf, document, video
            $table->string('url')->nullable();       // video externo, link
            $table->longText('content')->nullable(); // texto

            $table->unsignedInteger('duration_minutes')->nullable();

            // visibilidade
            $table->boolean('is_public')->default(false);

            // métricas (não derivadas)
            $table->unsignedInteger('view_count')->default(0);

            $table->timestamps();

            // índices
            $table->index(['type', 'is_public']);
            $table->index('user_id');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
