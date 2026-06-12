<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            // TODO(reference-doc): detail Lokasi/Kapasitas Gudang menunggu contoh dokumen Ijin Gudang dari team handak
            $table->decimal('area_sqm', 10, 2)->nullable()->after('capacity_kg');
            $table->string('village')->nullable()->after('address');
        });
    }

    public function down(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->dropColumn(['area_sqm', 'village']);
        });
    }
};
