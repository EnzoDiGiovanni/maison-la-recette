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
        Schema::table('podcasts', function (Blueprint $table) {
            $table->string('ausha_guid')->nullable()->unique()->after('id');
            $table->string('audio_url', 2048)->nullable()->after('link');
            $table->unsignedInteger('duration')->nullable()->after('audio_url');
            $table->boolean('is_published')->default(true)->after('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('podcasts', function (Blueprint $table) {
            $table->dropUnique(['ausha_guid']);
            $table->dropColumn(['ausha_guid', 'audio_url', 'duration', 'is_published']);
        });
    }
};
