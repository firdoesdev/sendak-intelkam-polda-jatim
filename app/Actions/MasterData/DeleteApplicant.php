<?php

namespace App\Actions\MasterData;

use App\Models\Applicant;

class DeleteApplicant
{
    public function __construct()
    {
        //
    }

    public function execute(int $id): void
    {
        Applicant::destroy($id);
    }
}
