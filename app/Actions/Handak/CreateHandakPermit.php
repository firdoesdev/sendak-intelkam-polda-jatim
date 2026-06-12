<?php

namespace App\Actions\Handak;

use App\Enums\PermitType;
use App\Enums\RecommendationType;
use App\Models\Applicant;
use App\Models\Permit;
use App\Services\HandakPermitService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreateHandakPermit
{
    public function __construct(private HandakPermitService $handakPermitService) {}

    public function execute(array $data): Permit
    {
        $recommendationType = RecommendationType::from($data['recommendation_type']);
        $applicant = Applicant::findOrFail($data['applicant_id']);

        $resolvedParent = $this->handakPermitService->assertCanCreate(
            $recommendationType,
            $applicant,
            $data['parent_permit_id'] ?? null,
            $data,
        );

        return DB::transaction(function () use ($data, $recommendationType, $resolvedParent) {
            $materials = $data['materials'] ?? [];
            $references = $data['references'] ?? [];
            unset($data['materials'], $data['references']);

            $data['permit_type'] = PermitType::HANDAK->value;
            $data['activity_type'] = $recommendationType->activityType()->value;
            $data['parent_permit_id'] = $resolvedParent?->id ?? $data['parent_permit_id'] ?? null;
            $data['created_by'] = Auth::id();
            $data['status'] = $data['status'] ?? 'draft';

            if ($data['status'] === 'pending') {
                $data['submitted_at'] = now();
            }

            // Masa berlaku otomatis dari default validity, kecuali Ijin Gudang (manual/dinamis)
            $validityDays = $recommendationType->defaultValidityDays();
            if ($validityDays !== null && empty($data['valid_to'])) {
                $data['valid_from'] = $data['valid_from'] ?? now()->toDateString();
                $data['valid_to'] = now()->parse($data['valid_from'])->addDays($validityDays)->toDateString();
            }

            $permit = Permit::create($data);

            foreach ($materials as $material) {
                $permit->explosivesMaterials()->create($material);
            }

            foreach ($references as $reference) {
                $permit->handakReferences()->create($reference);
            }

            return $permit;
        });
    }
}
