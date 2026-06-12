<?php

namespace App\Actions\Handak;

use App\Enums\PermitStatus;
use App\Enums\RecommendationType;
use App\Models\Permit;
use App\Services\HandakPermitService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApproveHandakPermit
{
    public function __construct(private HandakPermitService $handakPermitService) {}

    public function execute(int $id): Permit
    {
        $permit = Permit::findOrFail($id);

        if ($permit->status === PermitStatus::APPROVED->value) {
            throw ValidationException::withMessages([
                'status' => 'Rekom ini sudah disetujui.',
            ]);
        }

        return DB::transaction(function () use ($permit) {
            $permit->update([
                'status' => PermitStatus::APPROVED->value,
                'approved_at' => now(),
                'permit_number' => $permit->permit_number ?? $this->generateRekomNumber($permit),
                'updated_by' => Auth::id(),
            ]);

            // Pembelian (P2) yang disetujui menambah stok bahan peledak perusahaan
            if ($permit->recommendation_type === RecommendationType::P2->value) {
                $this->handakPermitService->recordPurchase($permit);
            }

            return $permit;
        });
    }

    private function generateRekomNumber(Permit $permit): string
    {
        // Mengikuti konvensi penomoran permit existing: HANDAK-[YEAR][MONTH]-[SEQUENTIAL]
        $year = now()->format('Y');
        $month = now()->format('m');
        $prefix = strtoupper($permit->permit_type);

        $lastPermit = Permit::where('permit_type', $permit->permit_type)
            ->whereYear('approved_at', $year)
            ->whereMonth('approved_at', $month)
            ->whereNotNull('permit_number')
            ->orderBy('permit_number', 'desc')
            ->first();

        $sequential = 1;
        if ($lastPermit && $lastPermit->permit_number) {
            $parts = explode('-', $lastPermit->permit_number);
            if (count($parts) === 3) {
                $sequential = intval($parts[2]) + 1;
            }
        }

        return sprintf('%s-%s%s-%04d', $prefix, $year, $month, $sequential);
    }
}
