<?php

namespace App\Actions\Handak;

use App\Enums\PermitStatus;
use App\Enums\RecommendationType;
use App\Models\Permit;
use App\Services\HandakPermitService;
use Illuminate\Validation\ValidationException;

class RecordHandakUsage
{
    public function __construct(private HandakPermitService $handakPermitService) {}

    public function execute(int $id, array $usages): Permit
    {
        $permit = Permit::findOrFail($id);

        $usageTypes = [RecommendationType::P3->value, RecommendationType::P1->value];

        if (! in_array($permit->recommendation_type, $usageTypes, true)) {
            throw ValidationException::withMessages([
                'permit_id' => 'Pemakaian hanya dapat dicatat pada rekom P3 atau P1.',
            ]);
        }

        if ($permit->status !== PermitStatus::APPROVED->value) {
            throw ValidationException::withMessages([
                'permit_id' => 'Pemakaian hanya dapat dicatat pada rekom yang sudah disetujui.',
            ]);
        }

        $this->handakPermitService->recordUsage($permit, $usages);

        return $permit;
    }
}
