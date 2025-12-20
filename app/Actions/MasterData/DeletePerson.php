<?php

namespace App\Actions\MasterData;

use App\Models\Person;
use Illuminate\Support\Facades\Storage;

class DeletePerson
{
    public function __construct()
    {
        //
    }

    public function execute(string $id): void
    {
        $person = Person::findOrFail($id);
        
        // Delete photo if exists
        if ($person->photo_path) {
            Storage::disk('public')->delete($person->photo_path);
        }
        
        $person->delete();
    }
}
