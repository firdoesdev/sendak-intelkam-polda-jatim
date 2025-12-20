<?php

namespace App\Actions\MasterData;

use App\Models\Warehouse;
use Request;

class ListWarehouse
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function execute(array $request)
    {
        //
        return Warehouse::with(['policeUnit', 'organization'])
            ->when($request['search'] ?? null, function ($query, $search) {
                $query->whereRaw('LOWER(name) like ?', ['%' . strtolower($search) . '%'])
                      ->orWhereRaw('LOWER(code) like ?', ['%' . strtolower($search) . '%'])
                      ->orWhereRaw('LOWER(city) like ?', ['%' . strtolower($search) . '%']);
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }
}
