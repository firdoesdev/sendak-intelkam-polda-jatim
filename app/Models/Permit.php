<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permit extends Model
{
    //
    protected $fillable = [
        'permit_number',
        'division_id',
        'applicant_id',
        'permit_type',
        'status',
        'submitted_at',
        'approved_at',
        'valid_from',
        'valid_to',
        'created_by',
        'updated_by',
    ];

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    
}
