<?php

namespace App\Actions\MasterData;

use App\Models\Organization;

class DeleteOrganization
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
        Organization::destroy($id);
    }
}
