<?php

namespace App\Actions\Weapons;

use App\Models\Weapon;
use App\Models\Person;
use App\Models\Permit;
use App\Models\WeaponHibahTransferRequest;
use Illuminate\Support\Facades\Auth;

class RequestWeaponHibahTransfer
{
    public function execute(
        Weapon $weapon,
        Person $fromOwner,
        Permit $fromPermit,
        Person $toOwner,
        Permit $toPermit,
        string $transferReason
    ): WeaponHibahTransferRequest {
        return WeaponHibahTransferRequest::create([
            'weapon_id' => $weapon->id,
            'from_person_id' => $fromOwner->id,
            'from_permit_id' => $fromPermit->id,
            'to_person_id' => $toOwner->id,
            'to_permit_id' => $toPermit->id,
            'transfer_reason' => $transferReason,
            'status' => 'draft',
            'requested_by' => Auth::id(),
        ]);
    }

    public function submit(WeaponHibahTransferRequest $request): void
    {
        $request->update([
            'status' => 'pending',
            'submitted_at' => now(),
        ]);
    }
}
