<?php

namespace App\Http\Controllers\Permits;

use App\Actions\Permits\CreatePermit;
use App\Actions\Permits\DeletePermit;
use App\Actions\Permits\UpdatePermit;
use App\Actions\Permits\ListPermit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Permits\PermitStoreRequest;
use App\Http\Requests\Permits\PermitUpdateRequest;

class PermitController extends Controller
{
    private $listPermit;
    private $createPermit;
    private $updatePermit;
    private $deletePermit;
    
    public function __construct(
        ListPermit $listPermit, 
        CreatePermit $createPermit, 
        UpdatePermit $updatePermit, 
        DeletePermit $deletePermit
    )
    {
        $this->listPermit = $listPermit;
        $this->createPermit = $createPermit;
        $this->updatePermit = $updatePermit;
        $this->deletePermit = $deletePermit;
    }
    
    public function index(Request $request)
    {
        return Inertia::render('permits/index',[
            'data' => $this->listPermit->execute([
                'search' => $request->search ?? null,
                'status' => $request->status ?? null,
                'permit_type' => $request->permit_type ?? null,
                'division_id' => $request->division_id ?? null,
            ])
        ]);
    }

    public function create()
    {
        //
    }

    public function store(PermitStoreRequest $request)
    {
        $this->createPermit->execute($request->validated());
        return to_route('permits.index')->with('success','Permit created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(PermitUpdateRequest $request, string $id)
    {
        $this->updatePermit->execute($id, $request->validated());
        return to_route('permits.index')->with('success','Permit updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->deletePermit->execute($id);
        return to_route('permits.index')->with('success','Permit deleted successfully.');
    }
}
