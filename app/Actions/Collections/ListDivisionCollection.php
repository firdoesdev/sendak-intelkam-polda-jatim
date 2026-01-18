<?php

namespace App\Actions\Collections;

use App\Models\Division;

class ListDivisionCollection
{
    public function __construct()
    {
        //
    }

    public function execute(?string $id = null)
    {
        return Division::select('id', 'code', 'name')
                ->where('is_active', true)
                ->when($id, fn($query, $id) => $query->where('id', $id))
                ->orderBy('name')->get();
    }
}
