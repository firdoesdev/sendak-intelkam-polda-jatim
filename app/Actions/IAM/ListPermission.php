<?php

namespace App\Actions\IAM;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class ListPermission
{
    /**
     * List permissions with optional search.
     */
    public function execute(array $filters = []): LengthAwarePaginator
    {
        $query = Permission::query()->orderBy('created_at', 'desc');

        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate(10);
    }
}
