<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeaponOwnershipHistory extends Model
{
    protected $table = 'weapon_ownership_history';

    protected $fillable = [
        'weapon_id',
        'owner_person_id',
        'permit_id',
        'owned_from',
        'owned_to',
        'transfer_type',
        'notes',
    ];

    protected $casts = [
        'owned_from' => 'date',
        'owned_to' => 'date',
    ];

    public function weapon(): BelongsTo
    {
        return $this->belongsTo(Weapon::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'owner_person_id');
    }

    public function permit(): BelongsTo
    {
        return $this->belongsTo(Permit::class);
    }

    public function getIsCurrentOwnerAttribute(): bool
    {
        return $this->owned_to === null;
    }
}
