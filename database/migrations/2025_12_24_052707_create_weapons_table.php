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
        Schema::create('weapons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('permit_type'); // SENPI, POLSUS, HANDAK, SPORT
            $table->string('weapon_type')->nullable(); // e.g., Pistol, Rifle, Baton
            $table->string('serial_number')->unique();
            $table->string('manufacturer')->nullable();
            $table->string('caliber')->nullable();
            $table->date('acquisition_date')->nullable();
            $table->enum('condition', ['new', 'excellent', 'good', 'fair', 'poor', 'damaged'])->default('good');
            $table->enum('status', ['available', 'issued', 'maintenance', 'decommissioned'])->default('available');
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('restrict');
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weapons');
    }
};
