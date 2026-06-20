<?php

namespace App\Http\Controllers\MasterData;

use App\Actions\MasterData\CreateWarehouse;
use App\Actions\MasterData\DeleteWarehouse;
use App\Actions\MasterData\ListWarehouse;
use App\Actions\MasterData\UpdateWarehouse;
use App\Http\Controllers\Controller;
use App\Http\Requests\MasterData\WarehouseStoreRequest;
use App\Http\Requests\MasterData\WarehouseUpdateRequest;
use App\Models\Organization;
use App\Models\PoliceUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $listWarehouse;
    private $createWarehouse;
    private $updateWarehouse;
    private $deleteWarehouse;

    public function __construct(
        ListWarehouse $listWarehouse,
        CreateWarehouse $createWarehouse,
        UpdateWarehouse $updateWarehouse,
        DeleteWarehouse $deleteWarehouse
    ) {
        $this->listWarehouse = $listWarehouse;
        $this->createWarehouse = $createWarehouse;
        $this->updateWarehouse = $updateWarehouse;
        $this->deleteWarehouse = $deleteWarehouse;
    }

    public function index(Request $request)
    {
        //
        return Inertia::render('master-data/warehouses/index', [
            'data' => Inertia::defer(fn()=>$this->listWarehouse->execute([
                'search' => $request->search ?? null
            ])),
            'policeUnits' => PoliceUnit::select('id', 'name', 'code')->where('is_active', true)->orderBy('name')->get(),
            'organizations' => Organization::select('id', 'name')->orderBy('name')->get(),
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
    public function store(WarehouseStoreRequest $request)
    {
        $this->createWarehouse->execute($request->validated());
        return to_route('master-data.warehouses.index')->with('success', 'Warehouse created successfully.');
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
    public function update(WarehouseUpdateRequest $request, string $id)
    {
        //
        $this->updateWarehouse->execute($request->validated(), $id);
        return to_route('master-data.warehouses.index')->with('success', 'Warehouse updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $this->deleteWarehouse->execute($id);
        return to_route('master-data.warehouses.index')->with('success', 'Warehouse deleted successfully.');
    }
}
