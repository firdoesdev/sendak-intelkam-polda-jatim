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
        Schema::create('permit_renewals', function (Blueprint $table) {
            $table->id();
            $table->string('renewal_number')->nullable()->unique();
            $table->foreignId('permit_id')->constrained('permits')->onDelete('cascade');
            $table->date('current_valid_to');
            $table->date('new_valid_to');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft');
            $table->text('reason')->nullable();
            $table->foreignId('requested_by')->constrained('users');
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permit_renewals');
    }
};
