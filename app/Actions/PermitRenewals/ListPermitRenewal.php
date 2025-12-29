<?php

namespace App\Actions\PermitRenewals;

use App\Models\PermitRenewal;
use Illuminate\Pagination\LengthAwarePaginator;

class ListPermitRenewal
{
    public function execute(array $filters = []): LengthAwarePaginator
    {
        $query = PermitRenewal::with(['permit.division', 'permit.applicant', 'requester', 'approver']);

        // Filter by status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by permit
        if (!empty($filters['permit_id'])) {
            $query->where('permit_id', $filters['permit_id']);
        }

        // Search by renewal number or permit number
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('renewal_number', 'like', "%{$search}%")
                    ->orWhereHas('permit', function ($q) use ($search) {
                        $q->where('permit_number', 'like', "%{$search}%");
                    });
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
    }
}
