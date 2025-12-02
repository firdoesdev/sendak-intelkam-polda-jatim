<?php

namespace App\Actions\IAM;

use App\Models\User;

class DeleteUser
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function execute(int $id): void
    {
        User::destroy($id);
    }
}
