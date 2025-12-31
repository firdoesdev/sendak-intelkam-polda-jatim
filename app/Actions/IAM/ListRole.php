<?php

namespace App\Actions\IAM;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class ListRole
{
    /**
     * List roles with optional search.
     */
    public function execute(array $filters = []): LengthAwarePaginator
    {
        $query = Role::query()->orderBy('created_at', 'desc');

        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate(10);
    }
}
