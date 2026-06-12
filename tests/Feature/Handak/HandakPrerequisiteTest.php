<?php

use App\Enums\PermitStatus;
use App\Enums\PermitType;
use App\Enums\RecommendationType;
use App\Models\Applicant;
use App\Models\Division;
use App\Models\ExplosivesStockLedger;
use App\Models\Permit;
use App\Models\Warehouse;
use App\Services\HandakPermitService;
use Illuminate\Validation\ValidationException;

function createHandakPermit(Applicant $applicant, RecommendationType $type, array $overrides = []): Permit
{
    return Permit::factory()->create(array_merge([
        'division_id' => Division::factory()->create(['code' => fake()->unique()->lexify('??????')])->id,
        'applicant_id' => $applicant->id,
        'permit_type' => PermitType::HANDAK->value,
        'recommendation_type' => $type->value,
        'status' => PermitStatus::APPROVED->value,
        'valid_from' => now()->subMonth(),
        'valid_to' => now()->addMonths(6),
    ], $overrides));
}

beforeEach(function () {
    $this->service = app(HandakPermitService::class);
    $this->applicant = Applicant::factory()->organization()->create();
});

test('rekom handak ditolak untuk pemohon tanpa perusahaan', function () {
    $personApplicant = Applicant::factory()->create();

    $this->service->assertCanCreate(RecommendationType::IJIN_GUDANG, $personApplicant, null, []);
})->throws(ValidationException::class);

test('ijin gudang wajib memilih gudang', function () {
    $this->service->assertCanCreate(RecommendationType::IJIN_GUDANG, $this->applicant, null, [
        'valid_from' => now()->toDateString(),
        'valid_to' => now()->addYear()->toDateString(),
    ]);
})->throws(ValidationException::class);

test('ijin gudang wajib mengisi masa berlaku manual', function () {
    $warehouse = Warehouse::factory()->create();

    $this->service->assertCanCreate(RecommendationType::IJIN_GUDANG, $this->applicant, null, [
        'warehouse_id' => $warehouse->id,
    ]);
})->throws(ValidationException::class);

test('ijin gudang lolos dengan gudang dan masa berlaku lengkap', function () {
    $warehouse = Warehouse::factory()->create();

    $parent = $this->service->assertCanCreate(RecommendationType::IJIN_GUDANG, $this->applicant, null, [
        'warehouse_id' => $warehouse->id,
        'valid_from' => now()->toDateString(),
        'valid_to' => now()->addYear()->toDateString(),
    ]);

    expect($parent)->toBeNull();
});

test('p3 diblokir tanpa ijin gudang aktif', function () {
    $this->service->assertCanCreate(RecommendationType::P3, $this->applicant, null, []);
})->throws(ValidationException::class, 'Rekom P3 memerlukan Ijin Gudang yang disetujui dan masih berlaku.');

test('p3 diblokir jika ijin gudang sudah kadaluarsa', function () {
    createHandakPermit($this->applicant, RecommendationType::IJIN_GUDANG, [
        'valid_to' => now()->subDay(),
    ]);

    $this->service->assertCanCreate(RecommendationType::P3, $this->applicant, null, []);
})->throws(ValidationException::class);

test('p3 lolos dengan ijin gudang aktif dan menjadikannya induk', function () {
    $ijinGudang = createHandakPermit($this->applicant, RecommendationType::IJIN_GUDANG);

    $parent = $this->service->assertCanCreate(RecommendationType::P3, $this->applicant, null, []);

    expect($parent)->not->toBeNull()
        ->and($parent->id)->toBe($ijinGudang->id);
});

test('p2 diblokir tanpa induk p3', function () {
    $this->service->assertCanCreate(RecommendationType::P2, $this->applicant, null, []);
})->throws(ValidationException::class, 'Rekom P2 wajib merujuk rekom P3 sebagai induk.');

test('p2 diblokir jika p3 induk sudah kadaluarsa', function () {
    $p3 = createHandakPermit($this->applicant, RecommendationType::P3, [
        'valid_to' => now()->subDay(),
    ]);

    $this->service->assertCanCreate(RecommendationType::P2, $this->applicant, $p3->id, []);
})->throws(ValidationException::class);

test('p2 diblokir jika p3 induk milik perusahaan lain', function () {
    $otherApplicant = Applicant::factory()->organization()->create();
    $p3 = createHandakPermit($otherApplicant, RecommendationType::P3);

    $this->service->assertCanCreate(RecommendationType::P2, $this->applicant, $p3->id, []);
})->throws(ValidationException::class);

test('p2 lolos dengan p3 aktif milik perusahaan yang sama', function () {
    $p3 = createHandakPermit($this->applicant, RecommendationType::P3);

    $parent = $this->service->assertCanCreate(RecommendationType::P2, $this->applicant, $p3->id, []);

    expect($parent->id)->toBe($p3->id);
});

test('p1 diblokir saat p3 induk masih aktif', function () {
    $p3 = createHandakPermit($this->applicant, RecommendationType::P3);

    $this->service->assertCanCreate(RecommendationType::P1, $this->applicant, $p3->id, []);
})->throws(ValidationException::class);

test('p1 diblokir jika tidak ada sisa stok', function () {
    $p3 = createHandakPermit($this->applicant, RecommendationType::P3, [
        'status' => PermitStatus::EXPIRED->value,
        'valid_to' => now()->subDay(),
    ]);

    $this->service->assertCanCreate(RecommendationType::P1, $this->applicant, $p3->id, [
        'materials' => [
            ['material_type' => 'Amonium Nitrate / Anfo', 'unit' => 'kg', 'weight' => 100, 'quantity' => 1],
        ],
    ]);
})->throws(ValidationException::class);

test('p1 diblokir jika jumlah diajukan melebihi sisa stok', function () {
    $p3 = createHandakPermit($this->applicant, RecommendationType::P3, [
        'status' => PermitStatus::EXPIRED->value,
        'valid_to' => now()->subDay(),
    ]);

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $this->applicant->organization_id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'unit' => 'kg',
        'quantity' => 50,
    ]);

    $this->service->assertCanCreate(RecommendationType::P1, $this->applicant, $p3->id, [
        'materials' => [
            ['material_type' => 'Amonium Nitrate / Anfo', 'unit' => 'kg', 'weight' => 100, 'quantity' => 1],
        ],
    ]);
})->throws(ValidationException::class);

test('p1 lolos dengan p3 selesai dan sisa stok mencukupi', function () {
    $p3 = createHandakPermit($this->applicant, RecommendationType::P3, [
        'status' => PermitStatus::EXPIRED->value,
        'valid_to' => now()->subDay(),
    ]);

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $this->applicant->organization_id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'unit' => 'kg',
        'quantity' => 500,
    ]);

    $parent = $this->service->assertCanCreate(RecommendationType::P1, $this->applicant, $p3->id, [
        'materials' => [
            ['material_type' => 'Amonium Nitrate / Anfo', 'unit' => 'kg', 'weight' => 100, 'quantity' => 2],
        ],
    ]);

    expect($parent->id)->toBe($p3->id);
});
