<?php

namespace App\Actions\MasterData;

use App\Models\Organization;

class UpdateOrganization
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    
    public function execute(array $data, string $id)
    {
        $organization = Organization::findOrFail($id);
        $organization->update($data);
        return $organization;
    }
}
