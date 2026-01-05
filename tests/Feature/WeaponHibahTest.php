<?php

use App\Models\User;
use App\Models\Weapon;
use App\Models\Person;
use App\Models\Warehouse;
use App\Models\WeaponOwnershipHistory;
use App\Models\WeaponHibahTransferRequest;
use App\Enums\AcquisitionType;
use App\Enums\TransferType;

test('weapon can have acquisition type new or hibah', function () {
    $warehouse = Warehouse::factory()->create();
    
    $newWeapon = Weapon::factory()->create([
        'acquisition_type' => AcquisitionType::NEW->value,
        'warehouse_id' => $warehouse->id,
    ]);

    $hibahWeapon = Weapon::factory()->create([
        'acquisition_type' => AcquisitionType::HIBAH->value,
        'warehouse_id' => $warehouse->id,
    ]);

    expect($newWeapon->acquisition_type)->toBe('new');
    expect($hibahWeapon->acquisition_type)->toBe('hibah');
});

test('hibah weapon can track previous owner', function () {
    $warehouse = Warehouse::factory()->create();
    $previousOwner = Person::factory()->create();
    
    $weapon = Weapon::factory()->create([
        'acquisition_type' => AcquisitionType::HIBAH->value,
        'previous_owner_id' => $previousOwner->id,
        'transfer_date' => now()->subMonth(),
        'warehouse_id' => $warehouse->id,
    ]);

    expect($weapon->previousOwner->id)->toBe($previousOwner->id);
    expect($weapon->transfer_date)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
});

test('weapon ownership history can be tracked', function () {
    $warehouse = Warehouse::factory()->create();
    $weapon = Weapon::factory()->create(['warehouse_id' => $warehouse->id]);
    $owner1 = Person::factory()->create();
    $owner2 = Person::factory()->create();

    // First ownership
    WeaponOwnershipHistory::create([
        'weapon_id' => $weapon->id,
        'owner_person_id' => $owner1->id,
        'owned_from' => now()->subYear(),
        'owned_to' => now()->subMonth(),
        'transfer_type' => TransferType::PURCHASE->value,
    ]);

    // Current ownership
    WeaponOwnershipHistory::create([
        'weapon_id' => $weapon->id,
        'owner_person_id' => $owner2->id,
        'owned_from' => now()->subMonth(),
        'owned_to' => null,
        'transfer_type' => TransferType::HIBAH->value,
    ]);

    $history = $weapon->ownershipHistory()->orderBy('owned_from')->get();
    
    expect($history->count())->toBe(2);
    expect($history->first()->owner->id)->toBe($owner1->id);
    expect($history->last()->owner->id)->toBe($owner2->id);
    expect($history->last()->is_current_owner)->toBeTrue();
});

test('hibah transfer request can be created', function () {
    $user = User::factory()->create();
    $warehouse = Warehouse::factory()->create();
    $weapon = Weapon::factory()->create(['warehouse_id' => $warehouse->id]);
    $fromOwner = Person::factory()->create();
    $toOwner = Person::factory()->create();

    $request = WeaponHibahTransferRequest::create([
        'weapon_id' => $weapon->id,
        'from_owner_id' => $fromOwner->id,
        'to_owner_id' => $toOwner->id,
        'status' => 'pending',
        'requested_by' => $user->id,
        'submitted_at' => now(),
        'notes' => 'Transfer from parent to child',
    ]);

    expect($request->weapon->id)->toBe($weapon->id);
    expect($request->fromOwner->id)->toBe($fromOwner->id);
    expect($request->toOwner->id)->toBe($toOwner->id);
    expect($request->status)->toBe('pending');
});

test('hibah transfer request tracks approval', function () {
    $requester = User::factory()->create();
    $approver = User::factory()->create();
    $warehouse = Warehouse::factory()->create();
    $weapon = Weapon::factory()->create(['warehouse_id' => $warehouse->id]);
    $fromOwner = Person::factory()->create();
    $toOwner = Person::factory()->create();

    $request = WeaponHibahTransferRequest::create([
        'weapon_id' => $weapon->id,
        'from_owner_id' => $fromOwner->id,
        'to_owner_id' => $toOwner->id,
        'status' => 'pending',
        'requested_by' => $requester->id,
        'submitted_at' => now(),
    ]);

    // Approve
    $request->update([
        'status' => 'approved',
        'approved_by' => $approver->id,
        'approved_at' => now(),
        'request_number' => 'HIBAH-202601-0001',
    ]);

    expect($request->status)->toBe('approved');
    expect($request->approver->id)->toBe($approver->id);
    expect($request->request_number)->toBe('HIBAH-202601-0001');
});
