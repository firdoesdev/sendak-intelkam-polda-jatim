<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_id')->constrained('persons')->onDelete('cascade');
            $table->string('test_type');
            $table->date('test_date');
            $table->date('expiry_date');
            $table->string('result');
            $table->integer('score')->nullable();
            $table->foreignId('certificate_document_id')->nullable()->constrained('permit_documents')->onDelete('set null');
            $table->string('issued_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['person_id', 'test_type']);
            $table->index('expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_results');
    }
};
