<?php

namespace App\Actions\Handak;

use App\Enums\PermitStatus;
use App\Models\Permit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdateHandakPermit
{
    public function execute(int $id, array $data): Permit
    {
        $permit = Permit::findOrFail($id);

        if (! in_array($permit->status, [PermitStatus::DRAFT->value, PermitStatus::PENDING->value], true)) {
            throw ValidationException::withMessages([
                'status' => 'Rekom yang sudah diproses tidak dapat diubah.',
            ]);
        }

        return DB::transaction(function () use ($permit, $data) {
            $materials = $data['materials'] ?? null;
            $references = $data['references'] ?? null;
            unset($data['materials'], $data['references']);

            $data['updated_by'] = Auth::id();

            if (($data['status'] ?? null) === PermitStatus::PENDING->value && $permit->status === PermitStatus::DRAFT->value) {
                $data['submitted_at'] = now();
            }

            $permit->update($data);

            if ($materials !== null) {
                $permit->explosivesMaterials()->delete();
                foreach ($materials as $material) {
                    $permit->explosivesMaterials()->create($material);
                }
            }

            if ($references !== null) {
                $permit->handakReferences()->delete();
                foreach ($references as $reference) {
                    $permit->handakReferences()->create($reference);
                }
            }

            return $permit;
        });
    }
}
