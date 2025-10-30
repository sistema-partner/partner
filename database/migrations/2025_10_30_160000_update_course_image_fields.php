<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Novos campos de path
            $table->string('image_path', 255)->nullable()->after('description');
            $table->string('cover_path', 255)->nullable()->after('image_path');
        });

        // Copia valores existentes de image_url para image_path (se ainda existir a coluna antiga)
        if (Schema::hasColumn('courses', 'image_url')) {
            DB::table('courses')->whereNotNull('image_url')->update([
                'image_path' => DB::raw('image_url'),
            ]);
            // Remove coluna antiga
            Schema::table('courses', function (Blueprint $table) {
                $table->dropColumn('image_url');
            });
        }
    }

    public function down(): void
    {
        // Recria image_url para reversão e copia dados de image_path
        Schema::table('courses', function (Blueprint $table) {
            $table->string('image_url', 255)->nullable()->after('description');
        });

        DB::table('courses')->whereNotNull('image_path')->update([
            'image_url' => DB::raw('image_path'),
        ]);

        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'cover_path']);
        });
    }
};
