<?php

namespace App\Http\Controllers\MasterData;

use App\Actions\MasterData\CreatePoliceUnit;
use App\Actions\MasterData\DeletePoliceUnit;
use App\Http\Controllers\Controller;
use App\Models\PoliceUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\MasterData\PoliceUnitStoreRequest;
use App\Http\Requests\MasterData\PoliceUnitUpdateRequest;
use App\Actions\MasterData\UpdatePoliceUnit;

class PoliceUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //

        return Inertia::render('master-data/police-units/index',[
            'data' => PoliceUnit::orderByDesc('created_at')->paginate(10)
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
    public function store(PoliceUnitStoreRequest $request, CreatePoliceUnit $createPoliceUnit)
    {
        $createPoliceUnit->execute($request->validated());
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
    public function update(PoliceUnitUpdateRequest $request, string $id, UpdatePoliceUnit $updatePoliceUnit)
    {
        //

        $updatePoliceUnit->execute($request->validated(), $id );
        return to_route('master-data.police-units.index')->with('success','Police Unit updated successfully.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, DeletePoliceUnit $deletePoliceUnit)
    {
        //
        $deletePoliceUnit->execute($id);
        return to_route('master-data.police-units.index')->with('success','Police Unit deleted successfully.');
    }
}
