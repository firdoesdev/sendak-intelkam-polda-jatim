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
        Schema::table('kartu_pengpin', function (Blueprint $table) {
            $table->timestamp('revoked_at')->nullable()->after('status');
            $table->foreignId('revoked_by')->nullable()->constrained('users')->after('revoked_at');
            $table->text('revoke_reason')->nullable()->after('revoked_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kartu_pengpin', function (Blueprint $table) {
            $table->dropForeign(['revoked_by']);
            $table->dropColumn(['revoked_at', 'revoked_by', 'revoke_reason']);
        });
    }
};
