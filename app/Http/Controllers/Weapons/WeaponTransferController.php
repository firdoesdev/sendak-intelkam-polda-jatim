<?php

namespace App\Http\Controllers\Weapons;

use App\Actions\Weapons\RequestTransferWeapon;
use App\Actions\Weapons\ApproveTransferWeapon;
use App\Http\Controllers\Controller;
use App\Http\Requests\Weapons\TransferRequestStoreRequest;
use App\Models\WeaponTransferRequest;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeaponTransferController extends Controller
{
    private $requestTransfer;
    private $approveTransfer;

    public function __construct(
        RequestTransferWeapon $requestTransfer,
        ApproveTransferWeapon $approveTransfer
    ) {
        $this->requestTransfer = $requestTransfer;
        $this->approveTransfer = $approveTransfer;
    }

    public function index(Request $request)
    {
        $query = WeaponTransferRequest::with([
            'weapon',
            'fromWarehouse',
            'toWarehouse',
            'requester',
            'approver'
        ]);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('request_number', 'like', "%{$search}%")
                    ->orWhereHas('weapon', function ($q) use ($search) {
                        $q->where('code', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        }

        $data = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('transfer-requests/index', [
            'data' => $data,
            'warehouses' => Warehouse::select('id', 'name', 'code')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(TransferRequestStoreRequest $request)
    {
        try {
            $this->requestTransfer->execute($request->validated());
            return to_route('weapons.transfer-requests.index')
                ->with('success', 'Permintaan transfer berhasil dibuat.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function approve(Request $request, string $id)
    {
        try {
            $this->approveTransfer->execute($id, null);
            return to_route('weapons.transfer-requests.index')
                ->with('success', 'Permintaan transfer berhasil disetujui.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function reject(Request $request, string $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        try {
            $this->approveTransfer->execute($id, $request->rejection_reason);
            return to_route('weapons.transfer-requests.index')
                ->with('success', 'Permintaan transfer ditolak.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
