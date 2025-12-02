<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    //

    protected $fillable = [
        'code',
        'name',
        'description',
        'is_active',
    ];

    public function permits()
    {
        return $this->hasMany(Permit::class);
    }

    
}
