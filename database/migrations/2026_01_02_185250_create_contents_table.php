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
            $table->enum('type', ['video', 'pdf', 'text', 'link']);
            $table->string('title')->nullable();
            $table->text('body')->nullable(); // texto ou link
            $table->string('file_url')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable(); // vídeo
            $table->timestamps();
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
