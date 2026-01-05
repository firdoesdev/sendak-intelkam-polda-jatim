<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('persons', function (Blueprint $table) {
            $table->string('ktp_number')->nullable()->after('national_id');
            $table->string('npwp_number')->nullable()->after('ktp_number');
            $table->string('buku_pas_number')->nullable()->after('npwp_number');
            $table->date('buku_pas_issued_at')->nullable()->after('buku_pas_number');
            $table->date('buku_pas_expired_at')->nullable()->after('buku_pas_issued_at');
            $table->string('kartu_ikhsa_takha_number')->nullable()->after('buku_pas_expired_at');
            $table->string('kartu_ikhsa_ikhsa_number')->nullable()->after('kartu_ikhsa_takha_number');
            $table->date('kartu_ikhsa_issued_at')->nullable()->after('kartu_ikhsa_ikhsa_number');
            $table->date('kartu_ikhsa_expired_at')->nullable()->after('kartu_ikhsa_issued_at');
        });
    }

    public function down(): void
    {
        Schema::table('persons', function (Blueprint $table) {
            $table->dropColumn([
                'ktp_number',
                'npwp_number',
                'buku_pas_number',
                'buku_pas_issued_at',
                'buku_pas_expired_at',
                'kartu_ikhsa_takha_number',
                'kartu_ikhsa_ikhsa_number',
                'kartu_ikhsa_issued_at',
                'kartu_ikhsa_expired_at',
            ]);
        });
    }
};
