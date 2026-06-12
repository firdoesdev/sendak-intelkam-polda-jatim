<?php

namespace App\Actions\Handak;

use App\Enums\PermitType;
use App\Models\Permit;

class ListHandakPermit
{
    public function execute(array $request)
    {
        return Permit::with([
            'applicant.person',
            'applicant.organization',
            'parentPermit:id,permit_number,si_number,recommendation_type',
            'warehouse:id,name,code,address,village,city,province,capacity_kg,area_sqm',
            'explosivesMaterials',
            'handakReferences',
            'creator',
            'updater',
        ])
            ->where('permit_type', PermitType::HANDAK->value)
            ->when($request['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereRaw('LOWER(permit_number) like ?', ['%'.strtolower($search).'%'])
                        ->orWhereRaw('LOWER(si_number) like ?', ['%'.strtolower($search).'%'])
                        ->orWhereHas('applicant', function ($q) use ($search) {
                            $q->whereRaw('LOWER(display_name) like ?', ['%'.strtolower($search).'%']);
                        });
                });
            })
            ->when($request['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request['recommendation_type'] ?? null, function ($query, $recommendationType) {
                $query->where('recommendation_type', $recommendationType);
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }
}
