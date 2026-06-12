<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'storage_type',
        'police_unit_id',
        'organization_id',
        'address',
        'village',
        'city',
        'province',
        'latitude',
        'longitude',
        'capacity_kg',
        'current_load_kg',
        'area_sqm',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'capacity_kg' => 'decimal:2',
        'current_load_kg' => 'decimal:2',
        'area_sqm' => 'decimal:2',
    ];

    public function policeUnit()
    {
        return $this->belongsTo(PoliceUnit::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function weapons()
    {
        return $this->hasMany(Weapon::class);
    }

    public function incomingTransfers()
    {
        return $this->hasMany(WeaponTransferRequest::class, 'to_warehouse_id');
    }

    public function outgoingTransfers()
    {
        return $this->hasMany(WeaponTransferRequest::class, 'from_warehouse_id');
    }
}
