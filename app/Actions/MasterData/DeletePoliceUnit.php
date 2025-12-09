<?php

namespace App\Actions\MasterData;

use App\Models\PoliceUnit;
class DeletePoliceUnit
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
        PoliceUnit::destroy($id);
    }
}
