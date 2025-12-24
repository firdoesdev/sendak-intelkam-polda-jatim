<?php

namespace App\Actions\Weapons;

use App\Models\Weapon;
use App\Models\WeaponMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReturnWeaponFromPermit
{
    public function execute(array $data): Weapon
    {
        return DB::transaction(function () use ($data) {
            $weapon = Weapon::findOrFail($data['weapon_id']);
            
            // Validate weapon is issued
            if ($weapon->status !== 'issued') {
                throw new \Exception('Senjata tidak dalam status dipinjamkan.');
            }
            
            // Get current permit
            $currentPermit = $weapon->currentPermit()->first();
            
            if (!$currentPermit) {
                throw new \Exception('Tidak ditemukan data peminjaman aktif untuk senjata ini.');
            }
            
            // Update pivot table
            $weapon->permits()->updateExistingPivot($currentPermit->id, [
                'returned_at' => now(),
                'condition_on_return' => $data['condition_on_return'],
                'notes' => DB::raw("CONCAT(COALESCE(notes, ''), '\nReturned: " . ($data['notes'] ?? '') . "')"),
            ]);
            
            // Update weapon status and condition
            $weapon->update([
                'status' => 'available',
                'condition' => $data['condition_on_return'],
            ]);
            
            // Create movement record
            WeaponMovement::create([
                'weapon_id' => $weapon->id,
                'movement_type' => 'check_in',
                'to_warehouse_id' => $weapon->warehouse_id,
                'permit_id' => $currentPermit->id,
                'moved_by' => Auth::id(),
                'moved_at' => now(),
                'notes' => $data['notes'] ?? 'Weapon returned from permit',
            ]);
            
            return $weapon->fresh();
        });
    }
}
