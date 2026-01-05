<?php

namespace App\Actions\Permits;

use App\Models\Permit;
use App\Models\Person;
use App\Models\Weapon;
use App\Models\KartuPengpin;

class GenerateKartuPengpin
{
    public function execute(
        Permit $permit,
        Person $person,
        Weapon $weapon,
        \DateTime $issuedAt,
        \DateTime $expiredAt
    ): KartuPengpin {
        // Generate pengpin number
        $yearMonth = $issuedAt->format('Ym');
        $sequence = str_pad(
            KartuPengpin::where('pengpin_number', 'like', "PENGPIN-{$yearMonth}-%")
                ->count() + 1,
            4,
            '0',
            STR_PAD_LEFT
        );
        $pengpinNumber = "PENGPIN-{$yearMonth}-{$sequence}";

        return KartuPengpin::create([
            'permit_id' => $permit->id,
            'person_id' => $person->id,
            'weapon_id' => $weapon->id,
            'pengpin_number' => $pengpinNumber,
            'issued_at' => $issuedAt,
            'expired_at' => $expiredAt,
            'status' => 'active',
        ]);
    }

    public function revoke(KartuPengpin $kartuPengpin, string $reason): void
    {
        $kartuPengpin->update([
            'status' => 'revoked',
            'revoked_at' => now(),
            'revoke_reason' => $reason,
        ]);
    }
}
