<?php

namespace App\Http\Controllers\Permits;

use App\Actions\PermitRenewals\RequestPermitRenewal;
use App\Actions\PermitRenewals\ApprovePermitRenewal;
use App\Actions\PermitRenewals\ListPermitRenewal;
use App\Http\Controllers\Controller;
use App\Http\Requests\PermitRenewals\PermitRenewalStoreRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermitRenewalController extends Controller
{
    private $listRenewal;
    private $requestRenewal;
    private $approveRenewal;

    public function __construct(
        ListPermitRenewal $listRenewal,
        RequestPermitRenewal $requestRenewal,
        ApprovePermitRenewal $approveRenewal
    ) {
        $this->listRenewal = $listRenewal;
        $this->requestRenewal = $requestRenewal;
        $this->approveRenewal = $approveRenewal;
    }

    public function index(Request $request)
    {
        return Inertia::render('permit-renewals/index', [
            'data' => $this->listRenewal->execute([
                'search' => $request->search ?? null,
                'status' => $request->status ?? null,
                'permit_id' => $request->permit_id ?? null,
            ]),
        ]);
    }

    public function store(PermitRenewalStoreRequest $request)
    {
        try {
            $this->requestRenewal->execute($request->validated());
            return to_route('permits.renewals.index')
                ->with('success', 'Permintaan perpanjangan izin berhasil dibuat.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function approve(Request $request, string $id)
    {
        // abort_unless($request->user()->can('approve-permit-renewal'), 403, 'Anda tidak memiliki izin untuk menyetujui perpanjangan.');
        
        try {
            $this->approveRenewal->execute($id, null);
            Inertia::flash('success', 'Perpanjangan izin berhasil disetujui.');
            return to_route('permits.renewals.index')
                ->with('success', 'Perpanjangan izin berhasil disetujui.');
        } catch (\Exception $e) {
            Inertia::flash('error', 'Gagal menyetujui perpanjangan izin: ' . $e->getMessage());
            return back()->with('error', $e->getMessage());
        }
    }

    public function reject(Request $request, string $id)
    {
        abort_unless($request->user()->can('approve-permit-renewal'), 403, 'Anda tidak memiliki izin untuk menolak perpanjangan.');
        
        $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        try {
            $this->approveRenewal->execute($id, $request->rejection_reason);
            return to_route('permits.renewals.index')
                ->with('success', 'Perpanjangan izin ditolak.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
