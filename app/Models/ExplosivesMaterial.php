<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExplosivesMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'permit_id',
        'material_type',
        'item_name',
        'weight',
        'quantity',
        'unit',
        'notes',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
    ];

    public function permit(): BelongsTo
    {
        return $this->belongsTo(Permit::class);
    }

    public function getTotalWeightAttribute(): float
    {
        return (float) ($this->weight * $this->quantity);
    }
}
