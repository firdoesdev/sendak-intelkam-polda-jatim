<?php

namespace App\Actions\Weapons;

use App\Models\Weapon;

class DeleteWeapon
{
    public function execute(int $id): bool
    {
        $weapon = Weapon::findOrFail($id);
        
        // Check if weapon is currently issued
        if ($weapon->status === 'issued') {
            throw new \Exception('Tidak dapat menghapus senjata yang sedang dipinjamkan.');
        }
        
        return $weapon->delete();
    }
}
