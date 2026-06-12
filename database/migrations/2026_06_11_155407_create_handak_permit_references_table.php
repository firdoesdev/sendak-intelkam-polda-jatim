<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('handak_permit_references', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permit_id')->constrained()->cascadeOnDelete();
            $table->string('reference_type');
            $table->string('document_number');
            $table->date('document_date')->nullable();
            $table->string('issuer')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('permit_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('handak_permit_references');
    }
};
