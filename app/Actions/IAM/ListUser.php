<?php

namespace App\Actions\IAM;

use App\Models\User;
class ListUser
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
        return User::with('roles')
            ->when($request['search'] ?? null, function ($query, $search) {
                $query->whereRaw('LOWER(name) like ?', ['%' . strtolower($search) . '%'])
                      ->orWhereRaw('LOWER(email) like ?', ['%' . strtolower($search) . '%']);
            })->orderByDesc('created_at')->paginate(10)->withQueryString();
    }
}
