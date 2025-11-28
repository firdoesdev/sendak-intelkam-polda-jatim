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
        Schema::create('persons', function (Blueprint $table) {
            $table->id();
            $table->string('national_id')->nullable();   // NIK / NRP
            $table->string('full_name');
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'unknown'])->default('unknown');
            $table->string('job_title')->nullable();
            $table->string('rank')->nullable();          // pangkat Polri, kalau ada
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->foreignId('police_unit_id')->nullable()->constrained('police_units');
            $table->foreignId('organization_id')->nullable()->constrained('organizations');
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};
