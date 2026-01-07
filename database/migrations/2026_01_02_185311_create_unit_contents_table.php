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
        Schema::create('unit_contents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('module_unit_id');
            $table->unsignedBigInteger('content_id');
            $table->unsignedInteger('order');
            $table->timestamps();

            $table->foreign('module_unit_id')->references('id')->on('module_units')->onDelete('cascade');
            $table->foreign('content_id')->references('id')->on('contents')->onDelete('cascade');
            $table->unique(['module_unit_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_contents');
    }
};
