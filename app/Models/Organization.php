<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'org_type',
        'registration_no',
        'tax_no',
        'address',
        'city',
        'province',
        'email',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class);
    }

    public function applicants()
    {
        return $this->hasMany(Applicant::class);
    }

    public function warehouses()
    {
        return $this->hasMany(Warehouse::class);
    }

    public function representatives()
    {
        return $this->hasMany(OrganizationRepresentative::class);
    }
}
