<?php

use App\Models\Permit;
use App\Models\KartuPengpin;
use App\Models\Person;
use App\Models\Weapon;
use App\Models\Applicant;
use App\Models\Division;
use App\Models\Warehouse;
use App\Enums\PermitType;

test('kartu pengpin can be created for POLSUS permit', function () {
    $division = Division::factory()->create(['code' => 'POLSUS']);
    $warehouse = Warehouse::factory()->create();
    $person = Person::factory()->create();
    $applicant = Applicant::factory()->create();
    $weapon = Weapon::factory()->create(['warehouse_id' => $warehouse->id]);

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
        'permit_type' => PermitType::POLSUS->value,
        'status' => 'approved',
    ]);

    $kartuPengpin = KartuPengpin::create([
        'pengpin_number' => 'PENGPIN-202601-0001',
        'permit_id' => $permit->id,
        'person_id' => $person->id,
        'weapon_id' => $weapon->id,
        'issue_date' => now(),
        'expiry_date' => now()->addYear(),
        'job_title' => 'Security Officer',
        'home_address' => '123 Main St',
        'buku_pas_reference' => 'BP-123',
        'status' => 'active',
    ]);

    expect($kartuPengpin->permit->id)->toBe($permit->id);
    expect($kartuPengpin->person->id)->toBe($person->id);
    expect($kartuPengpin->weapon->id)->toBe($weapon->id);
    expect($kartuPengpin->is_active)->toBeTrue();
});

test('kartu pengpin detects expiry correctly', function () {
    $division = Division::factory()->create();
    $warehouse = Warehouse::factory()->create();
    $person = Person::factory()->create();
    $applicant = Applicant::factory()->create();
    $weapon = Weapon::factory()->create(['warehouse_id' => $warehouse->id]);

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
    ]);

    $expiredPengpin = KartuPengpin::create([
        'pengpin_number' => 'PENGPIN-202601-0001',
        'permit_id' => $permit->id,
        'person_id' => $person->id,
        'weapon_id' => $weapon->id,
        'issue_date' => now()->subYear(),
        'expiry_date' => now()->subDay(),
        'job_title' => 'Security Officer',
        'home_address' => '123 Main St',
        'status' => 'active',
    ]);

    expect($expiredPengpin->is_expired)->toBeTrue();
    expect($expiredPengpin->is_active)->toBeFalse();
});

test('kartu pengpin ensures unique combination of permit person and weapon', function () {
    $division = Division::factory()->create();
    $warehouse = Warehouse::factory()->create();
    $person = Person::factory()->create();
    $applicant = Applicant::factory()->create();
    $weapon = Weapon::factory()->create(['warehouse_id' => $warehouse->id]);

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
    ]);

    KartuPengpin::create([
        'pengpin_number' => 'PENGPIN-202601-0001',
        'permit_id' => $permit->id,
        'person_id' => $person->id,
        'weapon_id' => $weapon->id,
        'issue_date' => now(),
        'expiry_date' => now()->addYear(),
        'job_title' => 'Security Officer',
        'home_address' => '123 Main St',
        'status' => 'active',
    ]);

    expect(function () use ($permit, $person, $weapon) {
        KartuPengpin::create([
            'pengpin_number' => 'PENGPIN-202601-0002',
            'permit_id' => $permit->id,
            'person_id' => $person->id,
            'weapon_id' => $weapon->id,
            'issue_date' => now(),
            'expiry_date' => now()->addYear(),
            'job_title' => 'Security Officer',
            'home_address' => '123 Main St',
            'status' => 'active',
        ]);
    })->toThrow(\Illuminate\Database\UniqueConstraintViolationException::class);
});

test('multiple persons can have kartu pengpin for same permit with different weapons', function () {
    $division = Division::factory()->create();
    $warehouse = Warehouse::factory()->create();
    $person1 = Person::factory()->create();
    $person2 = Person::factory()->create();
    $applicant = Applicant::factory()->create();
    $weapon1 = Weapon::factory()->create(['warehouse_id' => $warehouse->id]);
    $weapon2 = Weapon::factory()->create(['warehouse_id' => $warehouse->id]);

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
    ]);

    $pengpin1 = KartuPengpin::create([
        'pengpin_number' => 'PENGPIN-202601-0001',
        'permit_id' => $permit->id,
        'person_id' => $person1->id,
        'weapon_id' => $weapon1->id,
        'issue_date' => now(),
        'expiry_date' => now()->addYear(),
        'job_title' => 'Security Officer',
        'home_address' => '123 Main St',
        'status' => 'active',
    ]);

    $pengpin2 = KartuPengpin::create([
        'pengpin_number' => 'PENGPIN-202601-0002',
        'permit_id' => $permit->id,
        'person_id' => $person2->id,
        'weapon_id' => $weapon2->id,
        'issue_date' => now(),
        'expiry_date' => now()->addYear(),
        'job_title' => 'Security Manager',
        'home_address' => '456 Oak St',
        'status' => 'active',
    ]);

    expect($permit->kartuPengpin()->count())->toBe(2);
    expect($pengpin1->person->id)->toBe($person1->id);
    expect($pengpin2->person->id)->toBe($person2->id);
});
