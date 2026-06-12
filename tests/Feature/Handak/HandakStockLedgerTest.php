<?php

use App\Enums\PermitStatus;
use App\Enums\PermitType;
use App\Enums\RecommendationType;
use App\Enums\StockEntryType;
use App\Models\Applicant;
use App\Models\Division;
use App\Models\ExplosivesMaterial;
use App\Models\ExplosivesStockLedger;
use App\Models\Permit;
use App\Services\HandakPermitService;
use Illuminate\Validation\ValidationException;

beforeEach(function () {
    $this->service = app(HandakPermitService::class);
    $this->applicant = Applicant::factory()->organization()->create();
    $this->division = Division::factory()->create(['code' => 'HANDAK']);
});

function createHandakPermitWithMaterials(Applicant $applicant, Division $division, RecommendationType $type): Permit
{
    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
        'permit_type' => PermitType::HANDAK->value,
        'recommendation_type' => $type->value,
        'status' => PermitStatus::APPROVED->value,
    ]);

    ExplosivesMaterial::factory()->create([
        'permit_id' => $permit->id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'weight' => 100,
        'quantity' => 10,
        'unit' => 'kg',
    ]);

    ExplosivesMaterial::factory()->create([
        'permit_id' => $permit->id,
        'material_type' => 'Detonator Listrik',
        'weight' => 1,
        'quantity' => 500,
        'unit' => 'pcs',
    ]);

    return $permit;
}

test('persetujuan p2 menambah ledger per material dan satuan', function () {
    $p2 = createHandakPermitWithMaterials($this->applicant, $this->division, RecommendationType::P2);

    $this->service->recordPurchase($p2);

    expect(ExplosivesStockLedger::balanceFor($this->applicant->organization_id, 'Amonium Nitrate / Anfo', 'kg'))->toBe(1000.0)
        ->and(ExplosivesStockLedger::balanceFor($this->applicant->organization_id, 'Detonator Listrik', 'pcs'))->toBe(500.0)
        ->and(ExplosivesStockLedger::where('entry_type', StockEntryType::Purchase->value)->count())->toBe(2);
});

test('pencatatan pemakaian mengurangi saldo stok', function () {
    $p3 = createHandakPermitWithMaterials($this->applicant, $this->division, RecommendationType::P3);

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $this->applicant->organization_id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'unit' => 'kg',
        'quantity' => 1000,
    ]);

    $this->service->recordUsage($p3, [
        ['material_type' => 'Amonium Nitrate / Anfo', 'unit' => 'kg', 'quantity' => 400],
    ]);

    expect(ExplosivesStockLedger::balanceFor($this->applicant->organization_id, 'Amonium Nitrate / Anfo', 'kg'))->toBe(600.0);
});

test('pemakaian p1 tercatat sebagai pemakaian sisa', function () {
    $p1 = createHandakPermitWithMaterials($this->applicant, $this->division, RecommendationType::P1);

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $this->applicant->organization_id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'unit' => 'kg',
        'quantity' => 1000,
    ]);

    $this->service->recordUsage($p1, [
        ['material_type' => 'Amonium Nitrate / Anfo', 'unit' => 'kg', 'quantity' => 250],
    ]);

    expect(ExplosivesStockLedger::where('entry_type', StockEntryType::LeftoverUsage->value)->count())->toBe(1)
        ->and(ExplosivesStockLedger::balanceFor($this->applicant->organization_id, 'Amonium Nitrate / Anfo', 'kg'))->toBe(750.0);
});

test('pemakaian melebihi saldo ditolak', function () {
    $p3 = createHandakPermitWithMaterials($this->applicant, $this->division, RecommendationType::P3);

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $this->applicant->organization_id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'unit' => 'kg',
        'quantity' => 100,
    ]);

    $this->service->recordUsage($p3, [
        ['material_type' => 'Amonium Nitrate / Anfo', 'unit' => 'kg', 'quantity' => 150],
    ]);
})->throws(ValidationException::class);

test('saldo dikelompokkan per material dan satuan', function () {
    $organizationId = $this->applicant->organization_id;

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $organizationId,
        'material_type' => 'Detonator Cord',
        'unit' => 'm',
        'quantity' => 2000,
    ]);

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $organizationId,
        'material_type' => 'Detonator Listrik',
        'unit' => 'pcs',
        'quantity' => 300,
    ]);

    $balances = $this->service->getStockBalances($organizationId);

    expect($balances)->toHaveCount(2)
        ->and($balances->firstWhere('material_type', 'Detonator Cord')->balance)->toBe(2000.0)
        ->and($balances->firstWhere('material_type', 'Detonator Cord')->unit)->toBe('m')
        ->and($balances->firstWhere('material_type', 'Detonator Listrik')->balance)->toBe(300.0);
});

test('saldo organisasi lain tidak ikut terhitung', function () {
    $otherApplicant = Applicant::factory()->organization()->create();

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $otherApplicant->organization_id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'unit' => 'kg',
        'quantity' => 999,
    ]);

    expect(ExplosivesStockLedger::balanceFor($this->applicant->organization_id, 'Amonium Nitrate / Anfo', 'kg'))->toBe(0.0);
});
