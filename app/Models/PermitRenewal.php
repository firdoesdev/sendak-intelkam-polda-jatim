<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermitRenewal extends Model
{
    protected $fillable = [
        'renewal_number',
        'permit_id',
        'current_valid_to',
        'new_valid_to',
        'status',
        'reason',
        'requested_by',
        'submitted_at',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'current_valid_to' => 'date',
        'new_valid_to' => 'date',
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function permit(): BelongsTo
    {
        return $this->belongsTo(Permit::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
