<?php

namespace App\Http\Controllers\MasterData;

use App\Actions\MasterData\CreateOrganization;
use App\Actions\MasterData\DeleteOrganization;
use App\Actions\MasterData\UpdateOrganization;
use App\Actions\MasterData\ListOrganization;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\MasterData\OrganizationStoreRequest;
use App\Http\Requests\MasterData\OrganizationUpdateRequest;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $listOrganization;
    private $createOrganization;
    private $updateOrganization;
    private $deleteOrganization;
    
    public function __construct(
        ListOrganization $listOrganization, 
        CreateOrganization $createOrganization, 
        UpdateOrganization $updateOrganization, 
        DeleteOrganization $deleteOrganization
    )
    {
        $this->listOrganization = $listOrganization;
        $this->createOrganization = $createOrganization;
        $this->updateOrganization = $updateOrganization;
        $this->deleteOrganization = $deleteOrganization;
    }
    
    public function index(Request $request)
    {
        return Inertia::render('master-data/organizations/index',[
            'data' => Inertia::defer(fn()=>$this->listOrganization->execute([
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
    public function store(OrganizationStoreRequest $request)
    {
        $this->createOrganization->execute($request->validated());
        return to_route('master-data.organizations.index')->with('success','Organization created successfully.');
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
    public function update(OrganizationUpdateRequest $request, string $id)
    {
        $this->updateOrganization->execute($request->validated(), $id);
        return to_route('master-data.organizations.index')->with('success','Organization updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->deleteOrganization->execute($id);
        return to_route('master-data.organizations.index')->with('success','Organization deleted successfully.');
    }
}
