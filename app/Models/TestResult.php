<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestResult extends Model
{
    protected $fillable = [
        'person_id',
        'test_type',
        'test_date',
        'expiry_date',
        'result',
        'score',
        'certificate_document_id',
        'issued_by',
        'notes',
    ];

    protected $casts = [
        'test_date' => 'date',
        'expiry_date' => 'date',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

    public function certificateDocument(): BelongsTo
    {
        return $this->belongsTo(PermitDocument::class, 'certificate_document_id');
    }

    public function scopeValid($query)
    {
        return $query->where('expiry_date', '>', now())
            ->where('result', 'pass');
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function getIsPassedAttribute(): bool
    {
        return $this->result === 'pass';
    }
}
