<?php

namespace App\Http\Controllers\MasterData;

use App\Actions\MasterData\CreateApplicant;
use App\Actions\MasterData\DeleteApplicant;
use App\Actions\MasterData\UpdateApplicant;
use App\Actions\MasterData\ListApplicant;
use App\Http\Controllers\Controller;
use App\Models\Person;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\MasterData\ApplicantStoreRequest;
use App\Http\Requests\MasterData\ApplicantUpdateRequest;

class ApplicantController extends Controller
{
    private $listApplicant;
    private $createApplicant;
    private $updateApplicant;
    private $deleteApplicant;
    
    public function __construct(
        ListApplicant $listApplicant, 
        CreateApplicant $createApplicant, 
        UpdateApplicant $updateApplicant, 
        DeleteApplicant $deleteApplicant
    )
    {
        $this->listApplicant = $listApplicant;
        $this->createApplicant = $createApplicant;
        $this->updateApplicant = $updateApplicant;
        $this->deleteApplicant = $deleteApplicant;
    }
    
    public function index(Request $request)
    {
        return Inertia::render('master-data/applicants/index',[
            'data' => $this->listApplicant->execute([
                'search' => $request->search ?? null
            ]),
            'persons' => Person::select('id', 'full_name', 'national_id')->orderBy('full_name')->get(),
            'organizations' => Organization::select('id', 'name', 'org_type')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(ApplicantStoreRequest $request)
    {
        $this->createApplicant->execute($request->validated());
        return to_route('master-data.applicants.index')->with('success','Applicant created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(ApplicantUpdateRequest $request, string $id)
    {
        $this->updateApplicant->execute($id, $request->validated());
        return to_route('master-data.applicants.index')->with('success','Applicant updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->deleteApplicant->execute($id);
        return to_route('master-data.applicants.index')->with('success','Applicant deleted successfully.');
    }
}
