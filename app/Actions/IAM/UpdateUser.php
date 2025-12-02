<?php

namespace App\Actions\IAM;

use App\Models\User;

class UpdateUser
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function execute(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        $user->update($data);
        
        return $user;
    }
}
