<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('explosive_material_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('default_unit')->default('kg');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('explosive_material_types');
    }
};
