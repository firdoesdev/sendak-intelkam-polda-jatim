<?php

namespace App\Actions\Permits;

use App\Models\Permit;

class DeletePermit
{
    public function __construct()
    {
        //
    }

    public function execute(int $id): void
    {
        // TODO: Add permission check - only allow deletion of draft permits
        // or permits by authorized users
        Permit::destroy($id);
    }
}
