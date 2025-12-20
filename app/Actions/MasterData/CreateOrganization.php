<?php

namespace App\Actions\MasterData;

use App\Models\Organization;

class CreateOrganization
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function execute(array $data)
    {
        return Organization::create($data);
    }
}
