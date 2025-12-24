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
        'last_notified_at',
        'notification_count',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'valid_from' => 'date',
        'valid_to' => 'date',
        'last_notified_at' => 'datetime',
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

    public function weapons()
    {
        return $this->belongsToMany(Weapon::class, 'permit_weapons')
            ->withPivot(['issued_at', 'returned_at', 'condition_on_issue', 'condition_on_return', 'notes'])
            ->withTimestamps();
    }

    public function renewals()
    {
        return $this->hasMany(PermitRenewal::class);
    }

    public function movements()
    {
        return $this->hasMany(WeaponMovement::class);
    }

    
}
