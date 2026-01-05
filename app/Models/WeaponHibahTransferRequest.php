<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class WeaponHibahTransferRequest extends Model
{
    use LogsActivity;

    protected $fillable = [
        'request_number',
        'weapon_id',
        'from_owner_id',
        'to_owner_id',
        'to_permit_id',
        'status',
        'transfer_document_id',
        'requested_by',
        'submitted_at',
        'approved_by',
        'approved_at',
        'rejection_reason',
        'notes',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'request_number'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function weapon(): BelongsTo
    {
        return $this->belongsTo(Weapon::class);
    }

    public function fromOwner(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'from_owner_id');
    }

    public function toOwner(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'to_owner_id');
    }

    public function toPermit(): BelongsTo
    {
        return $this->belongsTo(Permit::class, 'to_permit_id');
    }

    public function transferDocument(): BelongsTo
    {
        return $this->belongsTo(PermitDocument::class, 'transfer_document_id');
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
