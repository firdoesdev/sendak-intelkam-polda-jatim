<?php

namespace App\Http\Controllers;

use App\Actions\Permits\GenerateKartuPengpin;
use App\Enums\KartuPengpinStatus;
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
        ->latest('issue_date')
        ->paginate(20);

        // Data untuk form create dialog
        $permits = Permit::select('id', 'permit_number', 'permit_type')
            ->where('permit_type', 'POLSUS')
            ->get();
        
        $persons = Person::select('id', 'full_name', 'national_id')
            ->get();
        
        $weapons = Weapon::select('id', 'serial_number', 'name')
            ->get();

        return Inertia::render('kartu-pengpin/index', [
            'data' => $kartuPengpin,
            'permits' => $permits,
            'persons' => $persons,
            'weapons' => $weapons,
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

        return Inertia::render('kartu-pengpin/show', [
            'kartuPengpin' => $kartuPengpin,
        ]);
    }

    public function store(GenerateKartuPengpinRequest $request)
    {
        $permit = Permit::findOrFail($request->input('permit_id'));
        $person = Person::findOrFail($request->input('person_id'));
        $weapon = Weapon::findOrFail($request->input('weapon_id'));

        // Validasi: Kartu Pengpin hanya untuk izin POLSUS
        if ($permit->permit_type !== 'POLSUS') {
            return back()->withErrors([
                'permit_id' => 'Kartu Pengpin hanya dapat diterbitkan untuk izin POLSUS (Penguasaan Pinjam Pakai Senjata Api Nonorganik)'
            ]);
        }

        // Cek apakah sudah ada kartu aktif untuk kombinasi ini
        $exists = KartuPengpin::where('permit_id', $permit->id)
            ->where('person_id', $person->id)
            ->where('weapon_id', $weapon->id)
            ->where('status', KartuPengpinStatus::ACTIVE)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'kartu_pengpin' => 'Kartu Pengpin aktif sudah ada untuk kombinasi permit, person, dan senjata ini'
            ]);
        }

        try {
            $kartuPengpin = $this->generateKartuPengpin->execute(
                permit: $permit,
                person: $person,
                weapon: $weapon,
                issueDate: new \DateTime($request->input('issue_date')),
                expiryDate: new \DateTime($request->input('expiry_date'))
            );

            Inertia::flash([
                'success' => 'Kartu Penguasaan Pinjam Pakai Senjata Api berhasil diterbitkan'
            ]);

            return redirect()
                ->route('kartu-pengpin.index', $kartuPengpin)
                ->with('success', 'Kartu Penguasaan Pinjam Pakai Senjata Api berhasil diterbitkan');
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

        return Inertia::render('kartu-pengpin/print', [
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

        if ($kartuPengpin->status !== KartuPengpinStatus::ACTIVE) {
            return back()->withErrors([
                'status' => 'Hanya Kartu Pengpin dengan status aktif yang dapat dicabut'
            ]);
        }

        $this->generateKartuPengpin->revoke(
            kartuPengpin: $kartuPengpin,
            reason: $request->input('reason')
        );

        return back()->with('success', 'Kartu Penguasaan Pinjam Pakai Senjata Api berhasil dicabut');
    }
}
