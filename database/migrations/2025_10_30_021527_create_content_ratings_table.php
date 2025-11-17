<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('stars')->unsigned()->between(1, 5);
            $table->text('comment')->nullable();
            $table->text('suggestions')->nullable()->comment('Sugestões de melhoria');
            $table->timestamps();
            
            $table->unique(['content_id', 'user_id']);
            $table->index(['content_id', 'stars']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_ratings');
    }
};