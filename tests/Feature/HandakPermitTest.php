<?php

use App\Models\Permit;
use App\Models\ExplosivesMaterial;
use App\Models\Warehouse;
use App\Models\Applicant;
use App\Models\Division;
use App\Enums\PermitType;
use App\Enums\RecommendationType;
use App\Enums\ActivityType;

test('HANDAK permit can have recommendation type', function () {
    $division = Division::factory()->create(['code' => 'HANDAK']);
    $applicant = Applicant::factory()->create();

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
        'permit_type' => PermitType::HANDAK->value,
        'recommendation_type' => RecommendationType::P1->value,
        'activity_type' => ActivityType::STORAGE->value,
        'status' => 'approved',
    ]);

    expect($permit->recommendation_type)->toBe('P1');
    expect($permit->activity_type)->toBe('storage');
});

test('HANDAK permit can have multiple explosives materials', function () {
    $division = Division::factory()->create();
    $applicant = Applicant::factory()->create();

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
        'permit_type' => PermitType::HANDAK->value,
    ]);

    ExplosivesMaterial::create([
        'permit_id' => $permit->id,
        'material_type' => 'Dynamite',
        'item_name' => 'Commercial Dynamite',
        'weight' => 50.00,
        'quantity' => 10,
        'unit' => 'kg',
    ]);

    ExplosivesMaterial::create([
        'permit_id' => $permit->id,
        'material_type' => 'TNT',
        'item_name' => 'Industrial TNT',
        'weight' => 25.00,
        'quantity' => 20,
        'unit' => 'kg',
    ]);

    expect($permit->explosivesMaterials()->count())->toBe(2);
});

test('explosives material calculates total weight correctly', function () {
    $division = Division::factory()->create();
    $applicant = Applicant::factory()->create();

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
    ]);

    $material = ExplosivesMaterial::create([
        'permit_id' => $permit->id,
        'material_type' => 'Dynamite',
        'item_name' => 'Commercial Dynamite',
        'weight' => 10.50,
        'quantity' => 5,
        'unit' => 'kg',
    ]);

    expect($material->total_weight)->toBe(52.5);
});

test('warehouse can track capacity for explosives', function () {
    $warehouse = Warehouse::factory()->create([
        'capacity_kg' => 1000.00,
        'current_load_kg' => 250.00,
    ]);

    expect($warehouse->capacity_kg)->toBe('1000.00');
    expect($warehouse->current_load_kg)->toBe('250.00');
});

test('recommendation type has default validity days', function () {
    $p1 = RecommendationType::P1;
    $p2 = RecommendationType::P2;
    $p3 = RecommendationType::P3;
    $ijinGudang = RecommendationType::IJIN_GUDANG;

    expect($p1->defaultValidityDays())->toBe(180);
    expect($p2->defaultValidityDays())->toBe(365);
    expect($p3->defaultValidityDays())->toBe(90);
    expect($ijinGudang->defaultValidityDays())->toBe(730);
});

test('permit can track activity type for HANDAK', function () {
    $division = Division::factory()->create();
    $applicant = Applicant::factory()->create();

    $storagePermit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
        'permit_type' => PermitType::HANDAK->value,
        'activity_type' => ActivityType::STORAGE->value,
    ]);

    $usagePermit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
        'permit_type' => PermitType::HANDAK->value,
        'activity_type' => ActivityType::USAGE->value,
    ]);

    expect($storagePermit->activity_type)->toBe('storage');
    expect($usagePermit->activity_type)->toBe('usage');
});
