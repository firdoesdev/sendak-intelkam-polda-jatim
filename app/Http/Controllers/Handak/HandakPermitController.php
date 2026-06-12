<?php

namespace App\Http\Controllers\Handak;

use App\Actions\Handak\ApproveHandakPermit;
use App\Actions\Handak\CreateHandakPermit;
use App\Actions\Handak\DeleteHandakPermit;
use App\Actions\Handak\IssueSiNumber;
use App\Actions\Handak\ListHandakPermit;
use App\Actions\Handak\RecordHandakUsage;
use App\Actions\Handak\UpdateHandakPermit;
use App\Enums\PermitStatus;
use App\Enums\PermitType;
use App\Enums\RecommendationType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Handak\HandakPermitStoreRequest;
use App\Http\Requests\Handak\HandakPermitUpdateRequest;
use App\Http\Requests\Handak\HandakUsageRequest;
use App\Http\Requests\Handak\IssueSiNumberRequest;
use App\Models\Applicant;
use App\Models\Division;
use App\Models\ExplosiveMaterialType;
use App\Models\ExplosivesStockLedger;
use App\Models\Permit;
use App\Models\Warehouse;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class HandakPermitController extends Controller
{
    public function __construct(
        private ListHandakPermit $listHandakPermit,
        private CreateHandakPermit $createHandakPermit,
        private UpdateHandakPermit $updateHandakPermit,
        private DeleteHandakPermit $deleteHandakPermit,
        private ApproveHandakPermit $approveHandakPermit,
        private IssueSiNumber $issueSiNumber,
        private RecordHandakUsage $recordHandakUsage,
    ) {}

    public function index(Request $request)
    {
        Gate::authorize('view-handak-permits');

        return Inertia::render('handak/index', [
            'data' => Inertia::defer(fn () => $this->listHandakPermit->execute([
                'search' => $request->search ?? null,
                'status' => $request->status ?? null,
                'recommendation_type' => $request->recommendation_type ?? null,
            ])),
            'division' => fn () => Division::where('code', 'HANDAK')->first(),
            'applicants' => fn () => Applicant::with('organization:id,name')
                ->whereNotNull('organization_id')
                ->orderBy('display_name')
                ->get(['id', 'display_name', 'applicant_type', 'organization_id']),
            'warehouses' => fn () => Warehouse::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'code', 'name', 'address', 'village', 'city', 'province', 'capacity_kg', 'area_sqm']),
            'materialTypes' => fn () => ExplosiveMaterialType::active()->orderBy('name')->get(['id', 'name', 'default_unit']),
            'parentOptions' => fn () => Permit::with('applicant:id,organization_id,display_name')
                ->where('permit_type', PermitType::HANDAK->value)
                ->where('recommendation_type', RecommendationType::P3->value)
                ->whereIn('status', [PermitStatus::APPROVED->value, PermitStatus::EXPIRED->value])
                ->orderByDesc('valid_to')
                ->get(['id', 'permit_number', 'si_number', 'applicant_id', 'status', 'valid_from', 'valid_to']),
            'stockBalances' => fn () => ExplosivesStockLedger::query()
                ->selectRaw('organization_id, material_type, unit, SUM(quantity) as balance')
                ->groupBy('organization_id', 'material_type', 'unit')
                ->get(),
            'auth' => [
                'user' => $request->user()?->load('defaultDivision'),
                'abilities' => [
                    'create-handak-permits' => Gate::allows('create-handak-permits'),
                    'edit-handak-permits' => Gate::allows('edit-handak-permits'),
                    'delete-handak-permits' => Gate::allows('delete-handak-permits'),
                    'approve-handak-permits' => Gate::allows('approve-handak-permits'),
                    'issue-handak-si' => Gate::allows('issue-handak-si'),
                    'record-handak-usage' => Gate::allows('record-handak-usage'),
                    'print-handak-letter' => Gate::allows('print-handak-letter'),
                ],
            ],
        ]);
    }

    public function store(HandakPermitStoreRequest $request)
    {
        try {
            $this->createHandakPermit->execute($request->validated());

            return to_route('handak-permits.index')->with('success', 'Rekom handak berhasil dibuat.');
        } catch (ValidationException $th) {
            throw $th;
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    public function update(HandakPermitUpdateRequest $request, string $id)
    {
        try {
            $this->updateHandakPermit->execute((int) $id, $request->validated());

            return to_route('handak-permits.index')->with('success', 'Rekom handak berhasil diperbarui.');
        } catch (ValidationException $th) {
            throw $th;
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    public function destroy(string $id)
    {
        Gate::authorize('delete-handak-permits');

        try {
            $this->deleteHandakPermit->execute((int) $id);

            return to_route('handak-permits.index')->with('success', 'Rekom handak berhasil dihapus.');
        } catch (ValidationException $th) {
            throw $th;
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    public function approve(string $id)
    {
        Gate::authorize('approve-handak-permits');

        try {
            $this->approveHandakPermit->execute((int) $id);

            return back()->with('success', 'Rekom handak disetujui.');
        } catch (ValidationException $th) {
            throw $th;
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    public function issueSi(IssueSiNumberRequest $request, string $id)
    {
        try {
            $this->issueSiNumber->execute((int) $id, $request->validated()['si_number']);

            return back()->with('success', 'No SI berhasil diterbitkan.');
        } catch (ValidationException $th) {
            throw $th;
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    public function recordUsage(HandakUsageRequest $request, string $id)
    {
        try {
            $this->recordHandakUsage->execute((int) $id, $request->validated()['usages']);

            return back()->with('success', 'Pemakaian bahan peledak berhasil dicatat.');
        } catch (ValidationException $th) {
            throw $th;
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }
}
