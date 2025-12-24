<?php

namespace App\Actions\Weapons;

use App\Models\Weapon;
use App\Models\Permit;
use App\Models\WeaponMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class IssueWeaponToPermit
{
    public function execute(array $data): Weapon
    {
        return DB::transaction(function () use ($data) {
            $weapon = Weapon::findOrFail($data['weapon_id']);
            $permit = Permit::findOrFail($data['permit_id']);
            
            // Validate weapon is available
            if ($weapon->status !== 'available') {
                throw new \Exception('Senjata tidak tersedia untuk dipinjamkan.');
            }
            
            // Validate permit is approved and valid
            if ($permit->status !== 'approved') {
                throw new \Exception('Izin belum disetujui.');
            }
            
            if ($permit->valid_to && $permit->valid_to < now()) {
                throw new \Exception('Izin sudah tidak berlaku.');
            }
            
            // Attach weapon to permit
            $permit->weapons()->attach($weapon->id, [
                'issued_at' => now(),
                'condition_on_issue' => $weapon->condition,
                'notes' => $data['notes'] ?? null,
            ]);
            
            // Update weapon status
            $weapon->update(['status' => 'issued']);
            
            // Create movement record
            WeaponMovement::create([
                'weapon_id' => $weapon->id,
                'movement_type' => 'check_out',
                'from_warehouse_id' => $weapon->warehouse_id,
                'permit_id' => $permit->id,
                'person_id' => $permit->applicant->person_id ?? null,
                'moved_by' => Auth::id(),
                'moved_at' => now(),
                'notes' => $data['notes'] ?? 'Weapon issued to permit',
            ]);
            
            return $weapon->fresh();
        });
    }
}
