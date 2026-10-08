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
            // Existing accounts, and the ones made with make:filament-user, are back-office accounts.
            $table->string('account_type')->default('admin')->index()->after('email');
            $table->string('phone')->nullable()->after('account_type');
            $table->string('company')->nullable()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['account_type']);
            $table->dropColumn(['account_type', 'phone', 'company']);
        });
    }
};
