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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['student', 'teacher', 'researcher', 'admin'])->default('student')->change();
            $table->string('avatar', 255)->nullable()->after('status');
            $table->string('phone', 20)->nullable()->after('avatar');
            $table->text('bio')->nullable()->after('phone');
            $table->string('institution', 255)->nullable()->after('bio');
            $table->index(['role', 'status'], 'users_role_status_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
