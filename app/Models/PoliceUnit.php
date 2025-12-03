<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PoliceUnit extends Model
{
    use HasFactory;
    //
    protected $fillable = [
        'code',
        'name',
        'unit_type',
        'region',
        'address',
        'parent_id',
        'is_active',
    ];

    public function parent()
    {
        return $this->belongsTo(PoliceUnit::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(PoliceUnit::class, 'parent_id');
    }

    public function persons()
    {
        return $this->hasMany(Person::class);
    }

    public function warehouses()
    {
        return $this->hasMany(Warehouse::class);
    }
}
