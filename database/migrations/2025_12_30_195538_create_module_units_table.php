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
        Schema::create('module_units', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('module_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', [
                'lesson',
                'quiz',
                'project',
                'code_exercise'
            ]);
            $table->unsignedInteger('order');
            $table->boolean('is_optional')->default(false);
            $table->timestamps();

            $table->foreign('module_id')->references('id')->on('course_modules')->onDelete('cascade');
            $table->unique(['module_id', 'order']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_units');
    }
};
