<?php

namespace App\Actions\Weapons;

use App\Models\Weapon;

class UpdateWeapon
{
    public function execute(int $id, array $data): Weapon
    {
        $weapon = Weapon::findOrFail($id);
        $weapon->update($data);
        
        return $weapon;
    }
}
