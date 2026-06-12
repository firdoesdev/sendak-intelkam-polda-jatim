<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HandakPermitReference extends Model
{
    use HasFactory;

    protected $fillable = [
        'permit_id',
        'reference_type',
        'document_number',
        'document_date',
        'issuer',
        'notes',
    ];

    protected $casts = [
        'document_date' => 'date',
    ];

    public function permit(): BelongsTo
    {
        return $this->belongsTo(Permit::class);
    }
}
