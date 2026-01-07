<?php

namespace App\Http\Controllers;

use App\Actions\Weapons\ApproveWeaponHibahTransfer;
use App\Actions\Weapons\RequestWeaponHibahTransfer;
use App\Http\Requests\ApproveHibahTransferRequest;
use App\Http\Requests\WeaponHibahTransferRequest as HibahTransferRequest;
use App\Models\Person;
use App\Models\Permit;
use App\Models\Weapon;
use App\Models\WeaponHibahTransferRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeaponHibahTransferController extends Controller
{
    public function __construct(
        private RequestWeaponHibahTransfer $requestHibahTransfer,
        private ApproveWeaponHibahTransfer $approveHibahTransfer
    ) {}

    public function index()
    {
        $transfers = WeaponHibahTransferRequest::with([
            'weapon',
            'fromOwner',
            'toOwner',
            'toPermit',
            'requester',
            'approver'
        ])
        ->latest('submitted_at')
        ->paginate(20);

        return Inertia::render('hibah-transfers/index', [
            'transfers' => $transfers,
        ]);

        // return Inertia::render('weapons/hibah-transfers/index' );
    }

    public function show(WeaponHibahTransferRequest $transfer)
    {
        $transfer->load([
            'weapon',
            'fromOwner',
            'toOwner',
            'toPermit',
            'requester',
            'approver',
            'activities'
        ]);

        return Inertia::render('hibah-transfers/show', [
            'transfer' => $transfer,
        ]);
    }

    public function store(HibahTransferRequest $request)
    {
        $weapon = Weapon::findOrFail($request->input('weapon_id'));
        $fromPerson = Person::findOrFail($request->input('from_person_id'));
        $fromPermit = Permit::findOrFail($request->input('from_permit_id'));
        $toPerson = Person::findOrFail($request->input('to_person_id'));
        $toPermit = Permit::findOrFail($request->input('to_permit_id'));

        $transfer = $this->requestHibahTransfer->execute(
            weapon: $weapon,
            fromOwner: $fromPerson,
            fromPermit: $fromPermit,
            toOwner: $toPerson,
            toPermit: $toPermit,
            transferReason: $request->input('transfer_reason')
        );

        return redirect()
            ->route('weapons.hibah-transfers.show', $transfer)
            ->with('success', 'Pengajuan hibah berhasil dibuat');
    }

    public function submit(WeaponHibahTransferRequest $transfer)
    {
        if ($transfer->status !== 'draft') {
            return back()->withErrors(['status' => 'Hanya pengajuan draft yang dapat diajukan']);
        }

        $this->requestHibahTransfer->submit($transfer);

        return back()->with('success', 'Pengajuan hibah berhasil diajukan untuk persetujuan');
    }

    public function approve(WeaponHibahTransferRequest $transfer, ApproveHibahTransferRequest $request)
    {
        if ($transfer->status !== 'pending') {
            return back()->withErrors(['status' => 'Hanya pengajuan pending yang dapat diproses']);
        }

        try {
            if ($request->input('action') === 'approve') {
                $this->approveHibahTransfer->approve(
                    request: $transfer,
                    notes: $request->input('notes')
                );
                $message = 'Pengajuan hibah berhasil disetujui';
            } else {
                $this->approveHibahTransfer->reject(
                    request: $transfer,
                    reason: $request->input('notes') ?? 'Ditolak'
                );
                $message = 'Pengajuan hibah ditolak';
            }

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['approval' => 'Gagal memproses pengajuan: ' . $e->getMessage()]);
        }
    }
}
