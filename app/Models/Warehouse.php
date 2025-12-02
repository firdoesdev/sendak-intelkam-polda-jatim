<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    //
    protected $fillable = [
        'code',
        'name',
        'storage_type',
        'police_unit_id',
        'organization_id',
        'address',
        'city',
        'province',
        'latitude',
        'longitude',
        'is_active',
    ];

    public function policeUnit()
    {
        return $this->belongsTo(PoliceUnit::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
