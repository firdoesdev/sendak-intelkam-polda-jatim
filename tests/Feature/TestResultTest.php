<?php

use App\Models\User;
use App\Models\Person;
use App\Models\TestResult;
use App\Enums\TestType;

test('person can have multiple test results', function () {
    $user = User::factory()->create();
    $person = Person::factory()->create();

    TestResult::create([
        'person_id' => $person->id,
        'test_type' => TestType::HEALTH->value,
        'test_date' => now(),
        'expiry_date' => now()->addYear(),
        'result' => 'pass',
        'score' => 90,
        'issued_by' => 'Test Authority',
    ]);

    TestResult::create([
        'person_id' => $person->id,
        'test_type' => TestType::PSYCHOLOGY->value,
        'test_date' => now(),
        'expiry_date' => now()->addYear(),
        'result' => 'pass',
        'score' => 85,
        'issued_by' => 'Test Authority',
    ]);

    TestResult::create([
        'person_id' => $person->id,
        'test_type' => TestType::SHOOTING->value,
        'test_date' => now(),
        'expiry_date' => now()->addYear(),
        'result' => 'pass',
        'score' => 95,
        'issued_by' => 'Test Authority',
    ]);

    expect($person->testResults()->count())->toBe(3);
    expect($person->has_valid_test_results)->toBeTrue();
});

test('person without all test results does not have valid test results', function () {
    $person = Person::factory()->create();

    TestResult::create([
        'person_id' => $person->id,
        'test_type' => TestType::HEALTH->value,
        'test_date' => now(),
        'expiry_date' => now()->addYear(),
        'result' => 'pass',
        'issued_by' => 'Test Authority',
    ]);

    expect($person->testResults()->count())->toBe(1);
    expect($person->has_valid_test_results)->toBeFalse();
});

test('expired test result is detected correctly', function () {
    $person = Person::factory()->create();

    $testResult = TestResult::create([
        'person_id' => $person->id,
        'test_type' => TestType::HEALTH->value,
        'test_date' => now()->subYear(),
        'expiry_date' => now()->subDay(),
        'result' => 'pass',
        'issued_by' => 'Test Authority',
    ]);

    expect($testResult->is_expired)->toBeTrue();
    expect($testResult->is_passed)->toBeTrue();
});

test('person can only have one test result per test type', function () {
    $person = Person::factory()->create();

    TestResult::create([
        'person_id' => $person->id,
        'test_type' => TestType::HEALTH->value,
        'test_date' => now(),
        'expiry_date' => now()->addYear(),
        'result' => 'pass',
        'issued_by' => 'Test Authority',
    ]);

    expect(function () use ($person) {
        TestResult::create([
            'person_id' => $person->id,
            'test_type' => TestType::HEALTH->value,
            'test_date' => now(),
            'expiry_date' => now()->addYear(),
            'result' => 'pass',
            'issued_by' => 'Test Authority',
        ]);
    })->toThrow(\Illuminate\Database\UniqueConstraintViolationException::class);
});

test('buku pas expiry is detected correctly', function () {
    $person = Person::factory()->create([
        'buku_pas_number' => 'BP-123',
        'buku_pas_issued_at' => now()->subYear(),
        'buku_pas_expired_at' => now()->subDay(),
    ]);

    expect($person->is_buku_pas_expired)->toBeTrue();
});

test('kartu ikhsa expiry is detected correctly', function () {
    $person = Person::factory()->create([
        'kartu_ikhsa_takha_number' => 'TAKHA-123',
        'kartu_ikhsa_ikhsa_number' => 'IKHSA-456',
        'kartu_ikhsa_issued_at' => now()->subYear(),
        'kartu_ikhsa_expired_at' => now()->subDay(),
    ]);

    expect($person->is_kartu_ikhsa_expired)->toBeTrue();
});
