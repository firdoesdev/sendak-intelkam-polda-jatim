<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Weapon extends Model
{
    protected $fillable = [
        'code',
        'name',
        'permit_type',
        'weapon_type',
        'serial_number',
        'manufacturer',
        'caliber',
        'acquisition_date',
        'condition',
        'status',
        'warehouse_id',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'acquisition_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(WeaponMovement::class);
    }

    public function transferRequests(): HasMany
    {
        return $this->hasMany(WeaponTransferRequest::class);
    }

    public function permits(): BelongsToMany
    {
        return $this->belongsToMany(Permit::class, 'permit_weapons')
            ->withPivot(['issued_at', 'returned_at', 'condition_on_issue', 'condition_on_return', 'notes'])
            ->withTimestamps();
    }

    public function currentPermit()
    {
        return $this->belongsToMany(Permit::class, 'permit_weapons')
            ->wherePivotNull('returned_at')
            ->withPivot(['issued_at', 'condition_on_issue', 'notes'])
            ->withTimestamps()
            ->latest('permit_weapons.created_at')
            ->limit(1);
    }
}
