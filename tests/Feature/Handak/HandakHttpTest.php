<?php

use App\Enums\PermitStatus;
use App\Enums\PermitType;
use App\Enums\RecommendationType;
use App\Models\Applicant;
use App\Models\Division;
use App\Models\ExplosivesMaterial;
use App\Models\ExplosivesStockLedger;
use App\Models\Permit;
use App\Models\User;
use App\Models\Warehouse;
use Spatie\Permission\Models\Permission;

function userWithHandakPermissions(array $permissions): User
{
    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
    }

    $user = User::factory()->create();
    $user->givePermissionTo($permissions);

    return $user;
}

function makeHandakPermit(Applicant $applicant, RecommendationType $type, array $overrides = []): Permit
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
    $this->applicant = Applicant::factory()->organization()->create();
    $this->division = Division::factory()->create(['code' => 'HANDAK']);
});

test('halaman rekom handak menolak user tanpa permission', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/handak-permits')->assertForbidden();
});

test('halaman rekom handak terbuka untuk user dengan permission view', function () {
    $user = userWithHandakPermissions(['view-handak-permits']);

    $this->actingAs($user)->get('/handak-permits')->assertSuccessful();
});

test('halaman stok menolak user tanpa permission', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/handak-stock')->assertForbidden();
});

test('halaman stok terbuka untuk user dengan permission view stok', function () {
    $user = userWithHandakPermissions(['view-handak-stock']);

    $this->actingAs($user)->get('/handak-stock')->assertSuccessful();
});

test('store ijin gudang membuat rekom beserta materials dan rujukan', function () {
    $user = userWithHandakPermissions(['create-handak-permits']);
    $warehouse = Warehouse::factory()->create();

    $response = $this->actingAs($user)->post('/handak-permits', [
        'division_id' => $this->division->id,
        'applicant_id' => $this->applicant->id,
        'recommendation_type' => RecommendationType::IJIN_GUDANG->value,
        'warehouse_id' => $warehouse->id,
        'valid_from' => now()->toDateString(),
        'valid_to' => now()->addYears(2)->toDateString(),
        'representative_name' => 'Widodo Ariawan',
        'representative_title' => 'Direktur',
        'materials' => [
            [
                'material_type' => 'Amonium Nitrate / Anfo',
                'item_name' => 'Anfo',
                'weight' => 100,
                'quantity' => 10,
                'unit' => 'kg',
            ],
        ],
        'references' => [
            [
                'reference_type' => 'esdm_letter',
                'document_number' => '500.10.29.5/3826/124.2/2023',
                'document_date' => '2023-10-19',
                'issuer' => 'Dinas ESDM Prov. Jatim',
            ],
        ],
    ]);

    $response->assertRedirect('/handak-permits');

    $permit = Permit::where('recommendation_type', RecommendationType::IJIN_GUDANG->value)->first();

    expect($permit)->not->toBeNull()
        ->and($permit->warehouse_id)->toBe($warehouse->id)
        ->and($permit->explosivesMaterials()->count())->toBe(1)
        ->and($permit->handakReferences()->count())->toBe(1);
});

test('store p2 tanpa p3 aktif ditolak dengan error validasi', function () {
    $user = userWithHandakPermissions(['create-handak-permits']);

    $response = $this->actingAs($user)->post('/handak-permits', [
        'division_id' => $this->division->id,
        'applicant_id' => $this->applicant->id,
        'recommendation_type' => RecommendationType::P2->value,
        'materials' => [
            [
                'material_type' => 'Amonium Nitrate / Anfo',
                'item_name' => 'Anfo',
                'weight' => 100,
                'quantity' => 10,
                'unit' => 'kg',
            ],
        ],
    ]);

    $response->assertSessionHasErrors('parent_permit_id');

    expect(Permit::where('recommendation_type', RecommendationType::P2->value)->count())->toBe(0);
});

test('store rekom ditolak untuk user tanpa permission create', function () {
    $user = userWithHandakPermissions(['view-handak-permits']);

    $this->actingAs($user)->post('/handak-permits', [
        'division_id' => $this->division->id,
        'applicant_id' => $this->applicant->id,
        'recommendation_type' => RecommendationType::IJIN_GUDANG->value,
    ])->assertForbidden();
});

test('approve p2 menerbitkan no rekom dan menambah stok', function () {
    $user = userWithHandakPermissions(['approve-handak-permits']);

    $p3 = makeHandakPermit($this->applicant, RecommendationType::P3);
    $p2 = makeHandakPermit($this->applicant, RecommendationType::P2, [
        'status' => PermitStatus::PENDING->value,
        'parent_permit_id' => $p3->id,
        'permit_number' => null,
    ]);

    ExplosivesMaterial::factory()->create([
        'permit_id' => $p2->id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'weight' => 100,
        'quantity' => 10,
        'unit' => 'kg',
    ]);

    $this->actingAs($user)
        ->post("/handak-permits/{$p2->id}/approve")
        ->assertRedirect();

    $p2->refresh();

    expect($p2->status)->toBe(PermitStatus::APPROVED->value)
        ->and($p2->permit_number)->not->toBeNull()
        ->and(ExplosivesStockLedger::balanceFor($this->applicant->organization_id, 'Amonium Nitrate / Anfo', 'kg'))->toBe(1000.0);
});

test('issue si menyimpan nomor si untuk rekom yang disetujui', function () {
    $user = userWithHandakPermissions(['issue-handak-si']);
    $permit = makeHandakPermit($this->applicant, RecommendationType::P3);

    $this->actingAs($user)
        ->post("/handak-permits/{$permit->id}/issue-si", [
            'si_number' => 'SI/4555/XI/YAN.2.12./2024',
        ])
        ->assertRedirect();

    expect($permit->refresh()->si_number)->toBe('SI/4555/XI/YAN.2.12./2024');
});

test('issue si ditolak untuk rekom yang belum disetujui', function () {
    $user = userWithHandakPermissions(['issue-handak-si']);
    $permit = makeHandakPermit($this->applicant, RecommendationType::P3, [
        'status' => PermitStatus::DRAFT->value,
    ]);

    $this->actingAs($user)
        ->post("/handak-permits/{$permit->id}/issue-si", [
            'si_number' => 'SI/9999/XI/YAN.2.12./2024',
        ])
        ->assertSessionHasErrors('si_number');
});

test('record usage mengurangi stok melalui endpoint', function () {
    $user = userWithHandakPermissions(['record-handak-usage']);
    $p3 = makeHandakPermit($this->applicant, RecommendationType::P3);

    ExplosivesStockLedger::factory()->create([
        'organization_id' => $this->applicant->organization_id,
        'material_type' => 'Amonium Nitrate / Anfo',
        'unit' => 'kg',
        'quantity' => 1000,
    ]);

    $this->actingAs($user)
        ->post("/handak-permits/{$p3->id}/record-usage", [
            'usages' => [
                ['material_type' => 'Amonium Nitrate / Anfo', 'unit' => 'kg', 'quantity' => 400],
            ],
        ])
        ->assertRedirect();

    expect(ExplosivesStockLedger::balanceFor($this->applicant->organization_id, 'Amonium Nitrate / Anfo', 'kg'))->toBe(600.0);
});

test('cetak surat menghasilkan pdf untuk user dengan permission', function () {
    $user = userWithHandakPermissions(['print-handak-letter']);
    $permit = makeHandakPermit($this->applicant, RecommendationType::P1, [
        'permit_number' => 'HANDAK-202606-0001',
    ]);

    $response = $this->actingAs($user)->get("/handak-permits/{$permit->id}/letter");

    $response->assertSuccessful();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
});

test('cetak surat ditolak tanpa permission', function () {
    $user = User::factory()->create();
    $permit = makeHandakPermit($this->applicant, RecommendationType::P1);

    $this->actingAs($user)->get("/handak-permits/{$permit->id}/letter")->assertForbidden();
});

test('cetak surat menolak permit non handak', function () {
    $user = userWithHandakPermissions(['print-handak-letter']);
    $permit = makeHandakPermit($this->applicant, RecommendationType::P1, [
        'permit_type' => PermitType::SENPI->value,
    ]);

    $this->actingAs($user)->get("/handak-permits/{$permit->id}/letter")->assertNotFound();
});
