<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('is_required')->default(true);
            $table->integer('estimated_duration_minutes')->nullable()->comment('Duração estimada em minutos');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['course_id', 'order']);
            $table->index(['course_id', 'is_public']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_modules');
    }
};