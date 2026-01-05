<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weapons', function (Blueprint $table) {
            $table->string('acquisition_type')->default('new')->after('weapon_type');
            $table->foreignId('previous_owner_id')->nullable()->constrained('persons')->after('acquisition_type');
            $table->foreignId('previous_owner_permit_id')->nullable()->constrained('permits')->after('previous_owner_id');
            $table->date('transfer_date')->nullable()->after('previous_owner_permit_id');
            // Note: import_permit_document_id will be added after permit_documents table exists
        });
    }

    public function down(): void
    {
        Schema::table('weapons', function (Blueprint $table) {
            $table->dropForeign(['previous_owner_id']);
            $table->dropForeign(['previous_owner_permit_id']);
            $table->dropColumn([
                'acquisition_type',
                'previous_owner_id',
                'previous_owner_permit_id',
                'transfer_date',
            ]);
        });
    }
};
