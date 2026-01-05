<?php

namespace App\Http\Controllers;

use App\Actions\Permits\GenerateKartuPengpin;
use App\Http\Requests\GenerateKartuPengpinRequest;
use App\Models\KartuPengpin;
use App\Models\Permit;
use App\Models\Person;
use App\Models\Weapon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KartuPengpinController extends Controller
{
    public function __construct(
        private GenerateKartuPengpin $generateKartuPengpin
    ) {}

    public function index()
    {
        $kartuPengpin = KartuPengpin::with([
            'permit',
            'person',
            'weapon'
        ])
        ->latest('issued_at')
        ->paginate(20);

        return Inertia::render('permits/kartu-pengpin/index', [
            'data' => $kartuPengpin,
        ]);
    }

    public function show(KartuPengpin $kartuPengpin)
    {
        $kartuPengpin->load([
            'permit',
            'person',
            'weapon',
            'activities'
        ]);

        return Inertia::render('permits/kartu-pengpin/show', [
            'kartuPengpin' => $kartuPengpin,
        ]);
    }

    public function store(GenerateKartuPengpinRequest $request)
    {
        $permit = Permit::findOrFail($request->input('permit_id'));
        $person = Person::findOrFail($request->input('person_id'));
        $weapon = Weapon::findOrFail($request->input('weapon_id'));

        // Check if permit is POLSUS
        if ($permit->permit_type !== 'POLSUS') {
            return back()->withErrors(['permit_id' => 'Kartu Pengpin hanya untuk ijin POLSUS']);
        }

        // Check if already exists
        $exists = KartuPengpin::where('permit_id', $permit->id)
            ->where('person_id', $person->id)
            ->where('weapon_id', $weapon->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['kartu_pengpin' => 'Kartu Pengpin sudah ada untuk kombinasi ini']);
        }

        try {
            $kartuPengpin = $this->generateKartuPengpin->execute(
                permit: $permit,
                person: $person,
                weapon: $weapon,
                issuedAt: new \DateTime($request->input('issued_at')),
                expiredAt: new \DateTime($request->input('expired_at'))
            );

            return redirect()
                ->route('kartu-pengpin.show', $kartuPengpin)
                ->with('success', 'Kartu Pengpin berhasil diterbitkan');
        } catch (\Exception $e) {
            return back()->withErrors(['kartu_pengpin' => 'Gagal menerbitkan Kartu Pengpin: ' . $e->getMessage()]);
        }
    }

    public function print(KartuPengpin $kartuPengpin)
    {
        $kartuPengpin->load([
            'permit',
            'person',
            'weapon'
        ]);

        return Inertia::render('permits/kartu-pengpin/print', [
            'kartuPengpin' => $kartuPengpin,
        ]);
    }

    public function revoke(KartuPengpin $kartuPengpin, Request $request)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ], [
            'reason.required' => 'Alasan pencabutan wajib diisi',
            'reason.max' => 'Alasan maksimal 500 karakter',
        ]);

        if ($kartuPengpin->status !== 'active') {
            return back()->withErrors(['status' => 'Hanya Kartu Pengpin aktif yang dapat dicabut']);
        }

        $this->generateKartuPengpin->revoke(
            kartuPengpin: $kartuPengpin,
            reason: $request->input('reason')
        );

        return back()->with('success', 'Kartu Pengpin berhasil dicabut');
    }
}
