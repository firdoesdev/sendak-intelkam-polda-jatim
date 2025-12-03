<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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

    public function users()
    {
        return $this->hasMany(User::class, 'default_division_id');
    }

    
}
