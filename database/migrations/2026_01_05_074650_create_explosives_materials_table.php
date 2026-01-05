<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('explosives_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permit_id')->constrained()->onDelete('cascade');
            $table->string('material_type');
            $table->string('item_name');
            $table->decimal('weight', 10, 2);
            $table->integer('quantity');
            $table->string('unit')->default('kg');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('permit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('explosives_materials');
    }
};
