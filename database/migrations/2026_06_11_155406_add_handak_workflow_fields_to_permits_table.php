<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permits', function (Blueprint $table) {
            $table->foreignId('parent_permit_id')->nullable()->after('applicant_id')->constrained('permits')->nullOnDelete();
            $table->foreignId('warehouse_id')->nullable()->after('parent_permit_id')->constrained('warehouses')->nullOnDelete();
            $table->string('si_number')->nullable()->unique()->after('permit_number');
            $table->string('representative_name')->nullable()->after('activity_type');
            $table->string('representative_title')->nullable()->after('representative_name');
            $table->string('representative_nationality')->nullable()->after('representative_title');
            $table->text('purpose')->nullable()->after('representative_nationality');
            $table->string('activity_location')->nullable()->after('purpose');
        });
    }

    public function down(): void
    {
        Schema::table('permits', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_permit_id');
            $table->dropConstrainedForeignId('warehouse_id');
            $table->dropColumn([
                'si_number',
                'representative_name',
                'representative_title',
                'representative_nationality',
                'purpose',
                'activity_location',
            ]);
        });
    }
};
