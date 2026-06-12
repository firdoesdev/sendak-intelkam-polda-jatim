<?php

namespace App\Services;

use App\Enums\PermitStatus;
use App\Enums\PermitType;
use App\Enums\RecommendationType;
use App\Enums\StockEntryType;
use App\Models\Applicant;
use App\Models\ExplosivesStockLedger;
use App\Models\Permit;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class HandakPermitService
{
    /**
     * Validasi alur prasyarat rekom handak sebelum dibuat.
     *
     * @param  array{warehouse_id?: int|null, valid_from?: string|null, valid_to?: string|null, materials?: array<int, array{material_type: string, unit: string, weight?: float|int, quantity?: int}>}  $data
     */
    public function assertCanCreate(RecommendationType $type, Applicant $applicant, ?int $parentPermitId, array $data = []): ?Permit
    {
        if (empty($applicant->organization_id)) {
            throw ValidationException::withMessages([
                'applicant_id' => 'Rekom handak hanya dapat diajukan oleh pemohon yang terhubung dengan perusahaan.',
            ]);
        }

        return match ($type) {
            RecommendationType::IJIN_GUDANG => $this->assertIjinGudang($data),
            RecommendationType::P3 => $this->assertP3($applicant),
            RecommendationType::P2 => $this->assertP2($applicant, $parentPermitId),
            RecommendationType::P1 => $this->assertP1($applicant, $parentPermitId, $data['materials'] ?? []),
        };
    }

    /**
     * Catat penambahan stok dari pembelian saat rekom P2 disetujui.
     */
    public function recordPurchase(Permit $permit): void
    {
        $permit->loadMissing(['applicant', 'explosivesMaterials']);

        foreach ($permit->explosivesMaterials as $material) {
            ExplosivesStockLedger::create([
                'organization_id' => $permit->applicant->organization_id,
                'permit_id' => $permit->id,
                'material_type' => $material->material_type,
                'unit' => $material->unit,
                'entry_type' => StockEntryType::Purchase->value,
                'quantity' => $material->total_weight,
                'transaction_date' => now()->toDateString(),
                'created_by' => Auth::id(),
            ]);
        }
    }

    /**
     * Catat pemakaian aktual (P3) atau pemakaian sisa (P1). Saldo tidak boleh negatif.
     *
     * @param  array<int, array{material_type: string, unit: string, quantity: float|int, notes?: string|null}>  $usages
     */
    public function recordUsage(Permit $permit, array $usages): void
    {
        $permit->loadMissing('applicant');
        $organizationId = $permit->applicant->organization_id;

        $recommendationType = RecommendationType::tryFrom((string) $permit->recommendation_type);
        $entryType = $recommendationType === RecommendationType::P1
            ? StockEntryType::LeftoverUsage
            : StockEntryType::Usage;

        foreach ($usages as $index => $usage) {
            $balance = ExplosivesStockLedger::balanceFor($organizationId, $usage['material_type'], $usage['unit']);

            if ($usage['quantity'] > $balance) {
                throw ValidationException::withMessages([
                    "usages.{$index}.quantity" => sprintf(
                        'Pemakaian %s melebihi sisa stok (%s %s tersedia).',
                        $usage['material_type'],
                        number_format($balance, 2),
                        $usage['unit'],
                    ),
                ]);
            }
        }

        foreach ($usages as $usage) {
            ExplosivesStockLedger::create([
                'organization_id' => $organizationId,
                'permit_id' => $permit->id,
                'material_type' => $usage['material_type'],
                'unit' => $usage['unit'],
                'entry_type' => $entryType->value,
                'quantity' => -abs((float) $usage['quantity']),
                'transaction_date' => now()->toDateString(),
                'notes' => $usage['notes'] ?? null,
                'created_by' => Auth::id(),
            ]);
        }
    }

    /**
     * Saldo stok per (material_type, unit) milik satu organisasi.
     */
    public function getStockBalances(int $organizationId): Collection
    {
        return ExplosivesStockLedger::balancesFor($organizationId);
    }

    /**
     * P2 tidak dapat diperpanjang; pembelian tambahan wajib P2 baru.
     */
    public function assertRenewable(Permit $permit): void
    {
        if ($permit->permit_type !== PermitType::HANDAK->value) {
            return;
        }

        $recommendationType = RecommendationType::tryFrom((string) $permit->recommendation_type);

        if ($recommendationType !== null && ! $recommendationType->isRenewable()) {
            throw ValidationException::withMessages([
                'permit_id' => 'Rekom P2 tidak dapat diperpanjang. Untuk pembelian tambahan, ajukan rekom P2 baru.',
            ]);
        }
    }

    private function assertIjinGudang(array $data): ?Permit
    {
        if (empty($data['warehouse_id'])) {
            throw ValidationException::withMessages([
                'warehouse_id' => 'Ijin Gudang wajib memilih gudang penyimpanan.',
            ]);
        }

        if (empty($data['valid_from']) || empty($data['valid_to'])) {
            throw ValidationException::withMessages([
                'valid_to' => 'Masa berlaku Ijin Gudang wajib diisi manual sesuai rekomendasi instansi terkait (mis. Dinas ESDM).',
            ]);
        }

        return null;
    }

    private function assertP3(Applicant $applicant): Permit
    {
        $ijinGudang = $this->activePermitQuery($applicant->organization_id, RecommendationType::IJIN_GUDANG)->latest('valid_to')->first();

        if ($ijinGudang === null) {
            throw ValidationException::withMessages([
                'recommendation_type' => 'Rekom P3 memerlukan Ijin Gudang yang disetujui dan masih berlaku.',
            ]);
        }

        return $ijinGudang;
    }

    private function assertP2(Applicant $applicant, ?int $parentPermitId): Permit
    {
        if ($parentPermitId === null) {
            throw ValidationException::withMessages([
                'parent_permit_id' => 'Rekom P2 wajib merujuk rekom P3 sebagai induk.',
            ]);
        }

        $parent = $this->activePermitQuery($applicant->organization_id, RecommendationType::P3)
            ->whereKey($parentPermitId)
            ->first();

        if ($parent === null) {
            throw ValidationException::withMessages([
                'parent_permit_id' => 'Rekom P2 memerlukan P3 yang disetujui, masih aktif, dan milik perusahaan yang sama.',
            ]);
        }

        return $parent;
    }

    /**
     * @param  array<int, array{material_type: string, unit: string, weight?: float|int, quantity?: int}>  $materials
     */
    private function assertP1(Applicant $applicant, ?int $parentPermitId, array $materials): Permit
    {
        if ($parentPermitId === null) {
            throw ValidationException::withMessages([
                'parent_permit_id' => 'Rekom P1 wajib merujuk rekom P3 sebagai induk.',
            ]);
        }

        $parent = $this->handakPermitQuery($applicant->organization_id, RecommendationType::P3)
            ->whereKey($parentPermitId)
            ->where(function (Builder $query) {
                $query->where('status', PermitStatus::EXPIRED->value)
                    ->orWhere(function (Builder $query) {
                        $query->where('status', PermitStatus::APPROVED->value)
                            ->whereDate('valid_to', '<', now());
                    });
            })
            ->first();

        if ($parent === null) {
            throw ValidationException::withMessages([
                'parent_permit_id' => 'Rekom P1 memerlukan P3 yang telah selesai masa berlakunya milik perusahaan yang sama.',
            ]);
        }

        foreach ($materials as $index => $material) {
            $balance = ExplosivesStockLedger::balanceFor($applicant->organization_id, $material['material_type'], $material['unit']);

            if ($balance <= 0) {
                throw ValidationException::withMessages([
                    "materials.{$index}.material_type" => sprintf('Tidak ada sisa stok %s untuk diajukan pada rekom P1.', $material['material_type']),
                ]);
            }

            $requested = (float) ($material['weight'] ?? 0) * (int) ($material['quantity'] ?? 1);

            if ($requested > $balance) {
                throw ValidationException::withMessages([
                    "materials.{$index}.weight" => sprintf(
                        'Jumlah %s yang diajukan melebihi sisa stok (%s %s tersedia).',
                        $material['material_type'],
                        number_format($balance, 2),
                        $material['unit'],
                    ),
                ]);
            }
        }

        return $parent;
    }

    private function handakPermitQuery(int $organizationId, RecommendationType $type): Builder
    {
        return Permit::query()
            ->where('permit_type', PermitType::HANDAK->value)
            ->where('recommendation_type', $type->value)
            ->whereHas('applicant', fn (Builder $query) => $query->where('organization_id', $organizationId));
    }

    private function activePermitQuery(int $organizationId, RecommendationType $type): Builder
    {
        return $this->handakPermitQuery($organizationId, $type)
            ->where('status', PermitStatus::APPROVED->value)
            ->whereDate('valid_to', '>=', now());
    }
}
