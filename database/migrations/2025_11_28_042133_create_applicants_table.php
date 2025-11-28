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
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->enum('applicant_type', ['person', 'organization']);
            $table->foreignId('person_id')->nullable()->constrained('persons');
            $table->foreignId('organization_id')->nullable()->constrained('organizations');
            $table->string('display_name'); // diisi otomatis dari person/org
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicants');
    }
};
