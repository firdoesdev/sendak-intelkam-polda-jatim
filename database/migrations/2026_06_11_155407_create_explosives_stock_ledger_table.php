<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('explosives_stock_ledger', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('material_type');
            $table->string('unit');
            $table->string('entry_type');
            $table->decimal('quantity', 12, 2);
            $table->date('transaction_date');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['organization_id', 'material_type', 'unit'], 'explosives_stock_balance_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('explosives_stock_ledger');
    }
};
