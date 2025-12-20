<?php

namespace App\Actions\MasterData;

use App\Models\Organization;

class ListOrganization
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
        return Organization::when($request['search'] ?? null, function ($query, $search) {
            $query->whereRaw('LOWER(name) like ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(registration_no) like ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(tax_no) like ?', ['%' . strtolower($search) . '%']);
        })->orderByDesc('created_at')->paginate(10)->withQueryString();
    }
}
