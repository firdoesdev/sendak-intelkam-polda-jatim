<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kartu_pengpin', function (Blueprint $table) {
            $table->id();
            $table->string('pengpin_number')->unique();
            $table->foreignId('permit_id')->constrained()->onDelete('cascade');
            $table->foreignId('person_id')->constrained('persons')->onDelete('cascade');
            $table->foreignId('weapon_id')->constrained()->onDelete('cascade');
            $table->date('issue_date');
            $table->date('expiry_date');
            $table->string('job_title');
            $table->text('home_address');
            $table->string('buku_pas_reference')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['permit_id', 'person_id', 'weapon_id']);
            $table->index('status');
            $table->index('expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kartu_pengpin');
    }
};
