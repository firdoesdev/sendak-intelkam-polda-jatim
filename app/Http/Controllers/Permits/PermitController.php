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
        Gate::authorize('viewAny', Permit::class);

        return Inertia::render('permits/index',[
            'data' => $this->listPermit->execute([
                'search' => $request->search ?? null,
                'status' => $request->status ?? null,
                'permit_type' => $request->permit_type ?? null,
                'division_id' => $request->division_id ?? null,
            ]),
            'divisions' => Division::select('id', 'code', 'name')->where('is_active', true)->orderBy('name')->get(),
            'applicants' => Applicant::select('id', 'display_name', 'applicant_type')->orderBy('display_name')->get(),
            'auth'=>[
                'user'=> $request->user(),
                'abilities'=> [
                    'request-permit-renewals' => Gate::allows('request-permit-renewals', PermitRenewal::class),
                ],
                // 'abilities'=> $request->user()->getAbilities(Permit::class),
            ],
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
