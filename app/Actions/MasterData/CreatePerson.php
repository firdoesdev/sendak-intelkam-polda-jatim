<?php

namespace App\Actions\MasterData;

use App\Models\Person;
use Illuminate\Support\Facades\Storage;

class CreatePerson
{
    public function __construct()
    {
        //
    }

    public function execute(array $data): Person
    {
        // Handle photo upload
        if (isset($data['photo']) && $data['photo']) {
            $path = $data['photo']->store('persons', 'public');
            $data['photo_path'] = $path;
            unset($data['photo']);
        }

        return Person::create($data);
    }
}
