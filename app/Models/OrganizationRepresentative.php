<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationRepresentative extends Model
{
    protected $fillable = [
        'organization_id',
        'person_id',
        'active_from',
        'active_to',
        'appointment_document_id',
    ];

    protected $casts = [
        'active_from' => 'date',
        'active_to' => 'date',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

    public function appointmentDocument(): BelongsTo
    {
        return $this->belongsTo(PermitDocument::class, 'appointment_document_id');
    }

    public function scopeCurrent($query)
    {
        return $query->whereNull('active_to');
    }

    public function getIsCurrentAttribute(): bool
    {
        return $this->active_to === null;
    }
}
