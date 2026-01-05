<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization_representatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('person_id')->constrained('persons')->onDelete('cascade');
            $table->date('active_from');
            $table->date('active_to')->nullable();
            $table->foreignId('appointment_document_id')->nullable()->constrained('permit_documents')->onDelete('set null');
            $table->timestamps();

            $table->index(['organization_id', 'active_to']);
            $table->index('person_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organization_representatives');
    }
};
