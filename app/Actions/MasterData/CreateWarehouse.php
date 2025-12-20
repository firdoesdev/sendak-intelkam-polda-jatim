<?php

namespace App\Actions\MasterData;

use App\Models\Warehouse;

class CreateWarehouse
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
        return Warehouse::create($data);
    }
}
