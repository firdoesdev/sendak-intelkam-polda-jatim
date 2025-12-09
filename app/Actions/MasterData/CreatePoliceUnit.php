<?php

namespace App\Actions\MasterData;

use App\Models\PoliceUnit;

class CreatePoliceUnit
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
        return PoliceUnit::create($data);
    }
}
