<?php

namespace App\Http\Controllers\Permits;

use App\Actions\Permits\CreatePermit;
use App\Actions\Permits\DeletePermit;
use App\Actions\Permits\UpdatePermit;
use App\Actions\Permits\ListPermit;
use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\Applicant;
use App\Models\PermitRenewal;
use Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Permits\PermitStoreRequest;
use App\Http\Requests\Permits\PermitUpdateRequest;
use App\Models\Permit;
use App\Actions\Collections\ListDivisionCollection;
use App\Actions\Collections\ListApplicantCollection;

class PermitController extends Controller
{
    private $listPermit;
    private $createPermit;
    private $updatePermit;
    private $deletePermit;
    private $listDivisionCollection;
    private $listApplicantCollection;
    public function __construct(
        ListPermit $listPermit, 
        CreatePermit $createPermit, 
        UpdatePermit $updatePermit, 
        DeletePermit $deletePermit,
        ListDivisionCollection $listDivisionCollection,
        ListApplicantCollection $listApplicantCollection
    )
    {
        $this->listPermit = $listPermit;
        $this->createPermit = $createPermit;
        $this->updatePermit = $updatePermit;
        $this->deletePermit = $deletePermit;
        $this->listDivisionCollection = $listDivisionCollection;
        $this->listApplicantCollection = $listApplicantCollection;
    }
    
    public function index(Request $request)
    {
        // Cek Permit viewing authorization
        Gate::authorize('viewAny', Permit::class);

        // Get user's default division id
        $userDivisionId = $request->user()->defaultDivision->id;
        
        return Inertia::render('permits/index',[
            'data' => Inertia::defer(fn()=> $this->listPermit->execute([
                'search' => $request->search ?? null,
                'status' => $request->status ?? null,
                'permit_type' => $request->permit_type ?? null,
                'division_id' => $request->division_id ?? null,
            ])),
            'divisions' => fn() => $this->listDivisionCollection->execute($userDivisionId),
            'applicants' => fn() => $this->listApplicantCollection->execute(),
            'auth'=>[
                'user'=> $request->user()?->load('defaultDivision'),
                'abilities'=> [
                    'request-permit-renewals' => Gate::allows('request-permit-renewals', PermitRenewal::class),
                ],
            ],
        ]);
    }

    public function create()
    {
        //
    }

    public function store(PermitStoreRequest $request)
    {
        try {
            //code...
            $this->createPermit->execute($request->validated());
            return to_route('permits.index')->with('success','Permit created successfully.');

        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
        
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
        try {
            //code...
            $this->updatePermit->execute($id, $request->validated());
            return to_route('permits.index')->with('success','Permit updated successfully.');
            
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
        
    }

    public function destroy(string $id)
    {
        try {
            //code...
            $this->deletePermit->execute($id);
            return to_route('permits.index')->with('success','Permit deleted successfully.');
            
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
        
    }
}
