<?php

namespace App\Actions\MasterData;

use App\Models\Person;
use Illuminate\Support\Facades\Storage;

class UpdatePerson
{
    public function __construct()
    {
        //
    }

    public function execute(string $id, array $data): Person
    {
        $person = Person::findOrFail($id);

        // Handle photo upload
        if (isset($data['photo']) && $data['photo']) {
            // Delete old photo if exists
            if ($person->photo_path) {
                Storage::disk('public')->delete($person->photo_path);
            }
            
            $path = $data['photo']->store('persons', 'public');
            $data['photo_path'] = $path;
            unset($data['photo']);
        }

        $person->update($data);
        return $person;
    }
}
