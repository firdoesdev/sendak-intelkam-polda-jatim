<?php

use App\Actions\PermitRenewals\RequestPermitRenewal;
use App\Enums\PermitStatus;
use App\Enums\PermitType;
use App\Enums\RecommendationType;
use App\Models\Applicant;
use App\Models\Division;
use App\Models\Permit;
use App\Services\HandakPermitService;
use Illuminate\Validation\ValidationException;

beforeEach(function () {
    $this->service = app(HandakPermitService::class);
    $this->applicant = Applicant::factory()->organization()->create();
    $this->division = Division::factory()->create(['code' => 'HANDAK']);
});

function createExpiredHandakPermit(Applicant $applicant, Division $division, RecommendationType $type): Permit
{
    return Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
        'permit_type' => PermitType::HANDAK->value,
        'recommendation_type' => $type->value,
        'status' => PermitStatus::EXPIRED->value,
        'valid_from' => now()->subYear(),
        'valid_to' => now()->subDay(),
    ]);
}

test('perpanjangan rekom p2 ditolak', function () {
    $p2 = createExpiredHandakPermit($this->applicant, $this->division, RecommendationType::P2);

    $this->service->assertRenewable($p2);
})->throws(ValidationException::class, 'Rekom P2 tidak dapat diperpanjang. Untuk pembelian tambahan, ajukan rekom P2 baru.');

test('perpanjangan rekom p2 ditolak melalui action permit renewal', function () {
    $p2 = createExpiredHandakPermit($this->applicant, $this->division, RecommendationType::P2);

    app(RequestPermitRenewal::class)->execute(['permit_id' => $p2->id]);
})->throws(ValidationException::class);

test('rekom selain p2 tetap dapat diperpanjang', function (RecommendationType $type) {
    $permit = createExpiredHandakPermit($this->applicant, $this->division, $type);

    $this->service->assertRenewable($permit);

    expect(true)->toBeTrue();
})->with([
    'P1' => RecommendationType::P1,
    'P3' => RecommendationType::P3,
    'Ijin Gudang' => RecommendationType::IJIN_GUDANG,
]);

test('permit non handak tidak terblokir oleh aturan p2', function () {
    $permit = Permit::factory()->create([
        'division_id' => $this->division->id,
        'applicant_id' => $this->applicant->id,
        'permit_type' => PermitType::SENPI->value,
        'recommendation_type' => null,
        'status' => PermitStatus::EXPIRED->value,
    ]);

    $this->service->assertRenewable($permit);

    expect(true)->toBeTrue();
});
