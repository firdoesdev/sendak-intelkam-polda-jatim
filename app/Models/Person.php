<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    //

    protected $fillable = [
        'national_id',
        'full_name',
        'birth_date',
        'gender',
        'job_title',
        'rank',
        'address',
        'city',
        'province',
        'police_unit_id',
        'organization_id',
        'photo_path',
    ];

    public function policeUnit()
    {
        return $this->belongsTo(PoliceUnit::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function applicants()
    {
        return $this->hasMany(Applicant::class);
    }

    
}
