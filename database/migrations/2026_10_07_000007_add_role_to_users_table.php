<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Everyone is a plain user unless explicitly made admin.
            $table->string('role')->default('utilisateur')->index()->after('email');
        });

        // The account type used to carry the admin flag: move it to the role.
        DB::table('users')->where('account_type', 'admin')->update(['role' => 'admin', 'account_type' => 'particulier']);

        Schema::table('users', function (Blueprint $table) {
            $table->string('account_type')->default('particulier')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('account_type')->default('admin')->change();
        });

        DB::table('users')->where('role', 'admin')->update(['account_type' => 'admin']);

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropColumn('role');
        });
    }
};
