<?php

use App\Models\Organization;
use App\Models\OrganizationRepresentative;
use App\Models\Person;

test('organization can have representatives', function () {
    $organization = Organization::factory()->create();
    $person1 = Person::factory()->create();
    $person2 = Person::factory()->create();

    // First representative (past)
    OrganizationRepresentative::create([
        'organization_id' => $organization->id,
        'person_id' => $person1->id,
        'active_from' => now()->subYear(),
        'active_to' => now()->subMonth(),
    ]);

    // Current representative
    OrganizationRepresentative::create([
        'organization_id' => $organization->id,
        'person_id' => $person2->id,
        'active_from' => now()->subMonth(),
        'active_to' => null,
    ]);

    expect($organization->representatives()->count())->toBe(2);
});

test('current representative scope works correctly', function () {
    $organization = Organization::factory()->create();
    $person1 = Person::factory()->create();
    $person2 = Person::factory()->create();

    OrganizationRepresentative::create([
        'organization_id' => $organization->id,
        'person_id' => $person1->id,
        'active_from' => now()->subYear(),
        'active_to' => now()->subMonth(),
    ]);

    $currentRep = OrganizationRepresentative::create([
        'organization_id' => $organization->id,
        'person_id' => $person2->id,
        'active_from' => now()->subMonth(),
        'active_to' => null,
    ]);

    $current = $organization->representatives()->current()->first();
    
    expect($current->id)->toBe($currentRep->id);
    expect($current->is_current)->toBeTrue();
});

test('representative can be changed', function () {
    $organization = Organization::factory()->create();
    $oldRep = Person::factory()->create();
    $newRep = Person::factory()->create();

    $representative = OrganizationRepresentative::create([
        'organization_id' => $organization->id,
        'person_id' => $oldRep->id,
        'active_from' => now()->subYear(),
        'active_to' => null,
    ]);

    // End current representative term
    $representative->update(['active_to' => now()]);

    // Add new representative
    OrganizationRepresentative::create([
        'organization_id' => $organization->id,
        'person_id' => $newRep->id,
        'active_from' => now(),
        'active_to' => null,
    ]);

    $currentReps = $organization->representatives()->current()->get();
    
    expect($currentReps->count())->toBe(1);
    expect($currentReps->first()->person->id)->toBe($newRep->id);
});
