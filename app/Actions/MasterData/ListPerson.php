<?php

namespace App\Actions\MasterData;

use App\Models\Person;

class ListPerson
{
    public function __construct()
    {
        //
    }

    public function execute(array $request)
    {
        return Person::with(['policeUnit', 'organization'])
            ->when($request['search'] ?? null, function ($query, $search) {
                $query->whereRaw('LOWER(full_name) like ?', ['%' . strtolower($search) . '%'])
                      ->orWhereRaw('LOWER(national_id) like ?', ['%' . strtolower($search) . '%'])
                      ->orWhereHas('policeUnit', function ($q) use ($search) {
                          $q->whereRaw('LOWER(name) like ?', ['%' . strtolower($search) . '%']);
                      })
                      ->orWhereHas('organization', function ($q) use ($search) {
                          $q->whereRaw('LOWER(name) like ?', ['%' . strtolower($search) . '%']);
                      });
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }
}
