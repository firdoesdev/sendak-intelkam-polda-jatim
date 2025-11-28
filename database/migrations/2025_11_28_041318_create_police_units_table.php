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
        Schema::create('police_units', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->enum('unit_type', ['polda', 'polres', 'polsek', 'lainnya'])->default('polres');
            $table->string('region')->nullable();     // contoh: "Gresik", "Jawa Timur"
            $table->text('address')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('police_units');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('police_units');
    }
};
