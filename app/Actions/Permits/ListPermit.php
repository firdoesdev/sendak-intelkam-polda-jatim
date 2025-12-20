<?php

namespace App\Actions\Permits;

use App\Models\Permit;

class ListPermit
{
    public function __construct()
    {
        //
    }

    public function execute(array $request)
    {
        return Permit::with(['division', 'applicant.person', 'applicant.organization', 'creator', 'updater'])
            ->when($request['search'] ?? null, function ($query, $search) {
                $query->whereRaw('LOWER(permit_number) like ?', ['%' . strtolower($search) . '%'])
                      ->orWhereHas('applicant', function ($q) use ($search) {
                          $q->whereRaw('LOWER(display_name) like ?', ['%' . strtolower($search) . '%']);
                      });
            })
            ->when($request['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request['permit_type'] ?? null, function ($query, $permitType) {
                $query->where('permit_type', $permitType);
            })
            ->when($request['division_id'] ?? null, function ($query, $divisionId) {
                $query->where('division_id', $divisionId);
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }
}
