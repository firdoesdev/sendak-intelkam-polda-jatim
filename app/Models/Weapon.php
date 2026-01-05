<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Weapon extends Model
{
    use HasFactory, LogsActivity;

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
        'acquisition_type',
        'previous_owner_id',
        'previous_owner_permit_id',
        'transfer_date',
        'import_permit_document_id',
    ];

    protected $casts = [
        'acquisition_date' => 'date',
        'transfer_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'condition', 'warehouse_id', 'acquisition_type'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

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

    public function hibahTransferRequests(): HasMany
    {
        return $this->hasMany(WeaponHibahTransferRequest::class);
    }

    public function ownershipHistory(): HasMany
    {
        return $this->hasMany(WeaponOwnershipHistory::class);
    }

    public function previousOwner(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'previous_owner_id');
    }

    public function previousOwnerPermit(): BelongsTo
    {
        return $this->belongsTo(Permit::class, 'previous_owner_permit_id');
    }

    public function importPermitDocument(): BelongsTo
    {
        return $this->belongsTo(PermitDocument::class, 'import_permit_document_id');
    }

    public function kartuPengpin(): HasMany
    {
        return $this->hasMany(KartuPengpin::class);
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
