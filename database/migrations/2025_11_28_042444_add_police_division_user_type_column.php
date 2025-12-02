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
            //
            $table->foreignId('police_unit_id')
                ->nullable()
                ->after('id')
                ->constrained('police_units');

            $table->foreignId('default_division_id')
                ->nullable()
                ->after('police_unit_id')
                ->constrained('divisions');

            $table->enum('user_type', ['internal', 'external'])
                ->default('internal')
                ->after('default_division_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
