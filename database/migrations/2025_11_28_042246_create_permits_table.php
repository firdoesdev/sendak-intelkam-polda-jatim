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
        Schema::create('permits', function (Blueprint $table) {
            $table->id();
            $table->string('permit_number')->nullable()->unique(); // diisi setelah approve, kalau mau
            $table->foreignId('division_id')->constrained('divisions');
            $table->foreignId('applicant_id')->constrained('applicants');
            $table->string('permit_type');  // senjata_api, polsus_unit, handak_gudang, dll
            $table->enum('status', [
                'draft',
                'pending',
                'approved',
                'rejected',
                'expired',
                'cancelled',
            ])->default('draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->date('valid_from')->nullable();
            $table->date('valid_to')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permits');
    }
};
