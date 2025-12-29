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
        Schema::create('weapon_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weapon_id')->constrained('weapons')->onDelete('cascade');
            $table->enum('movement_type', ['check_in', 'check_out', 'transfer', 'maintenance', 'return_from_maintenance', 'disposal']);
            $table->foreignId('from_warehouse_id')->nullable()->constrained('warehouses');
            $table->foreignId('to_warehouse_id')->nullable()->constrained('warehouses');
            $table->foreignId('permit_id')->nullable()->constrained('permits');
            $table->foreignId('person_id')->nullable()->constrained('persons');
            $table->foreignId('moved_by')->constrained('users');
            $table->timestamp('moved_at');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weapon_movements');
    }
};
