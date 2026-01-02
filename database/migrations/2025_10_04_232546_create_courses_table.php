<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();

            $table->string('title', 255);
            $table->string('code', 20)->unique();
            $table->text('description')->nullable();
            $table->string('image_url', 500)->nullable();

            $table->enum('status', [
                'planned',
                'active',
                'ended',
                'cancelled'
            ])->default('planned');

            $table->enum('visibility', [
                'public',
                'unlisted',
                'private'
            ])->default('public');

            $table->enum('enrollment_policy', [
                'closed',
                'auto_approve',
                'manual_approval'
            ])->default('manual_approval');

            $table->unsignedInteger('max_students')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            $table->timestamps();

            $table->index(['teacher_id', 'status']);
            $table->index(['visibility', 'status']);
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};