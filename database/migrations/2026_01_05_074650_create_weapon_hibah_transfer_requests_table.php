<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weapon_hibah_transfer_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->nullable()->unique();
            $table->foreignId('weapon_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_owner_id')->constrained('persons')->onDelete('cascade');
            $table->foreignId('to_owner_id')->constrained('persons')->onDelete('cascade');
            $table->foreignId('to_permit_id')->nullable()->constrained('permits')->onDelete('cascade');
            $table->string('status')->default('draft');
            $table->foreignId('transfer_document_id')->nullable()->constrained('permit_documents')->onDelete('set null');
            $table->foreignId('requested_by')->constrained('users');
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['weapon_id', 'status']);
            $table->index('from_owner_id');
            $table->index('to_owner_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weapon_hibah_transfer_requests');
    }
};
