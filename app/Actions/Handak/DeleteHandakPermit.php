<?php

namespace App\Actions\Handak;

use App\Enums\PermitStatus;
use App\Models\Permit;
use Illuminate\Validation\ValidationException;

class DeleteHandakPermit
{
    public function execute(int $id): void
    {
        $permit = Permit::findOrFail($id);

        if (! in_array($permit->status, [PermitStatus::DRAFT->value, PermitStatus::PENDING->value], true)) {
            throw ValidationException::withMessages([
                'status' => 'Rekom yang sudah disetujui tidak dapat dihapus.',
            ]);
        }

        $permit->delete();
    }
}
