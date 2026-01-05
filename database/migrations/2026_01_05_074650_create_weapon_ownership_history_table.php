<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weapon_ownership_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weapon_id')->constrained()->onDelete('cascade');
            $table->foreignId('owner_person_id')->constrained('persons')->onDelete('cascade');
            $table->foreignId('permit_id')->nullable()->constrained()->onDelete('set null');
            $table->date('owned_from');
            $table->date('owned_to')->nullable();
            $table->string('transfer_type');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['weapon_id', 'owned_from']);
            $table->index('owner_person_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weapon_ownership_history');
    }
};
