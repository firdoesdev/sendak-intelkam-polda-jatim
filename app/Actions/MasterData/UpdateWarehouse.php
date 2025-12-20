<?php

namespace App\Actions\MasterData;

use App\Models\Warehouse;

class UpdateWarehouse
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
        $warehouse = Warehouse::findOrFail($id);
        $warehouse->update($data);
        return $warehouse;
    }
}
