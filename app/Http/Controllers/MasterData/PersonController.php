<?php

namespace App\Http\Controllers\MasterData;

use App\Actions\MasterData\CreatePerson;
use App\Actions\MasterData\DeletePerson;
use App\Actions\MasterData\UpdatePerson;
use App\Actions\MasterData\ListPerson;
use App\Http\Controllers\Controller;
use App\Http\Requests\MasterData\PersonStoreRequest;
use App\Http\Requests\MasterData\PersonUpdateRequest;
use App\Models\Organization;
use App\Models\PoliceUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonController extends Controller
{
    private $listPerson;
    private $createPerson;
    private $updatePerson;
    private $deletePerson;
    
    public function __construct(
        ListPerson $listPerson, 
        CreatePerson $createPerson, 
        UpdatePerson $updatePerson, 
        DeletePerson $deletePerson
    )
    {
        $this->listPerson = $listPerson;
        $this->createPerson = $createPerson;
        $this->updatePerson = $updatePerson;
        $this->deletePerson = $deletePerson;
    }
    
    public function index(Request $request)
    {
        return Inertia::render('master-data/persons/index',[
            'data' => $this->listPerson->execute([
                'search' => $request->search ?? null
            ]),
            'policeUnits' => PoliceUnit::select('id', 'name', 'code')->where('is_active', true)->orderBy('name')->get(),
            'organizations' => Organization::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(PersonStoreRequest $request)
    {
        $this->createPerson->execute($request->validated());
        return to_route('master-data.persons.index')->with('success','Person created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(PersonUpdateRequest $request, string $id)
    {
        $this->updatePerson->execute($id, $request->validated());
        return to_route('master-data.persons.index')->with('success','Person updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->deletePerson->execute($id);
        return to_route('master-data.persons.index')->with('success','Person deleted successfully.');
    }
}
