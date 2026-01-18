<?php

namespace App\Actions\Collections;

use App\Models\Applicant;

class ListApplicantCollection
{
    public function __construct()
    {
        //
    }

    public function execute()
    {
        return Applicant::select('id', 'display_name', 'applicant_type')
                ->orderBy('display_name')->get();
    }
}
