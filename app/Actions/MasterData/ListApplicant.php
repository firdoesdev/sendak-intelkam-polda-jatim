<?php

namespace App\Actions\MasterData;

use App\Models\Applicant;

class ListApplicant
{
    public function __construct()
    {
        //
    }

    public function execute(array $request)
    {
        return Applicant::with(['person', 'organization'])
            ->when($request['search'] ?? null, function ($query, $search) {
                $query->whereRaw('LOWER(display_name) like ?', ['%' . strtolower($search) . '%'])
                      ->orWhereHas('person', function ($q) use ($search) {
                          $q->whereRaw('LOWER(full_name) like ?', ['%' . strtolower($search) . '%'])
                            ->orWhereRaw('LOWER(national_id) like ?', ['%' . strtolower($search) . '%']);
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
