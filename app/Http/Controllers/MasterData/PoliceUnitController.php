<?php

namespace App\Http\Controllers\MasterData;

use App\Actions\MasterData\CreatePoliceUnit;
use App\Actions\MasterData\DeletePoliceUnit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\MasterData\PoliceUnitStoreRequest;
use App\Http\Requests\MasterData\PoliceUnitUpdateRequest;
use App\Actions\MasterData\UpdatePoliceUnit;
use App\Actions\MasterData\ListPoliceUnit;

class PoliceUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $listPoliceUnit;
    private $createPoliceUnit;
    private $updatePoliceUnit;
    private $deletePoliceUnit;
    public function __construct(ListPoliceUnit $listPoliceUnit, CreatePoliceUnit $createPoliceUnit, UpdatePoliceUnit $updatePoliceUnit, DeletePoliceUnit $deletePoliceUnit)
    {
        $this->listPoliceUnit = $listPoliceUnit;
        $this->createPoliceUnit = $createPoliceUnit;
        $this->updatePoliceUnit = $updatePoliceUnit;
        $this->deletePoliceUnit = $deletePoliceUnit;
    }
    
    public function index(Request $request)
    {
        //
        return Inertia::render('master-data/police-units/index',[
            'data' => Inertia::defer(fn()=>$this->listPoliceUnit->execute([
                'search' => $request->search ?? null
            ]))
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PoliceUnitStoreRequest $request)
    {
        $this->createPoliceUnit->execute($request->validated());
        return to_route('master-data.police-units.index')->with('success','Police Unit created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PoliceUnitUpdateRequest $request, string $id)
    {
        //

        $this->updatePoliceUnit->execute($request->validated(), $id );
        return to_route('master-data.police-units.index')->with('success','Police Unit updated successfully.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $this->deletePoliceUnit->execute($id);
        return to_route('master-data.police-units.index')->with('success','Police Unit deleted successfully.');
    }
}
