<?php

namespace App\Actions\MasterData;

use App\Models\PoliceUnit;

class UpdatePoliceUnit
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
        $policeUnit = PoliceUnit::findOrFail($id);
        $policeUnit->update($data);
        return $policeUnit;
    }
}
