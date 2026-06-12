<?php

namespace App\Actions\Handak;

use App\Enums\PermitStatus;
use App\Models\Permit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class IssueSiNumber
{
    public function execute(int $id, string $siNumber): Permit
    {
        $permit = Permit::findOrFail($id);

        if ($permit->status !== PermitStatus::APPROVED->value) {
            throw ValidationException::withMessages([
                'si_number' => 'No SI hanya dapat diterbitkan untuk rekom yang sudah disetujui.',
            ]);
        }

        $permit->update([
            'si_number' => $siNumber,
            'updated_by' => Auth::id(),
        ]);

        return $permit;
    }
}
