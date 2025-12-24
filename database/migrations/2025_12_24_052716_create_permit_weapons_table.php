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
        Schema::create('permit_weapons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permit_id')->constrained('permits')->onDelete('cascade');
            $table->foreignId('weapon_id')->constrained('weapons')->onDelete('cascade');
            $table->timestamp('issued_at');
            $table->timestamp('returned_at')->nullable();
            $table->enum('condition_on_issue', ['new', 'excellent', 'good', 'fair', 'poor', 'damaged']);
            $table->enum('condition_on_return', ['new', 'excellent', 'good', 'fair', 'poor', 'damaged'])->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Ensure weapon can only be issued to one active permit at a time
            $table->unique(['weapon_id', 'returned_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permit_weapons');
    }
};
