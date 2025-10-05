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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id');
            $table->string('title', 255);
            $table->string('code', 20)->unique();
            $table->text('description')->nullable();
            $table->string('image_url', 255)->nullable();
            $table->enum('status', ['active', 'planned', 'ended', 'cancelled'])->default('planned');
            $table->enum('visibility', ['public', 'private'])->default('public');
            $table->unsignedInteger('max_students')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('accepts_enrollments')->default(true);
            $table->timestamps();

            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['teacher_id', 'status'], 'courses_teacher_status_index');
            $table->index(['status', 'start_date', 'end_date'], 'courses_status_date_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
