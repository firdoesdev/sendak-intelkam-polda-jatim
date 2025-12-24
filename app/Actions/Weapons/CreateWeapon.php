<?php

namespace App\Actions\Weapons;

use App\Models\Weapon;
use Illuminate\Support\Facades\Auth;

class CreateWeapon
{
    public function execute(array $data): Weapon
    {
        return Weapon::create($data);
    }
}
