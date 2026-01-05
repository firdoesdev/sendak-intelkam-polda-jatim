<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->decimal('capacity_kg', 10, 2)->nullable()->after('longitude');
            $table->decimal('current_load_kg', 10, 2)->default(0)->after('capacity_kg');
        });
    }

    public function down(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->dropColumn(['capacity_kg', 'current_load_kg']);
        });
    }
};
