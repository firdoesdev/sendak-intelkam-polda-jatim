<?php

namespace App\Actions\Permits;

use App\Enums\KartuPengpinStatus;
use App\Models\Permit;
use App\Models\Person;
use App\Models\Weapon;
use App\Models\KartuPengpin;
use Illuminate\Support\Facades\Auth;

/**
 * Generate Kartu Penguasaan Pinjam Pakai Senjata Api (Nonorganik)
 * 
 * Action untuk menerbitkan kartu izin penguasaan sementara senjata api 
 * nonorganik untuk tugas keamanan (Satpol PP, PPNS, Satpam, dll).
 */
class GenerateKartuPengpin
{
    /**
     * Terbitkan Kartu Pengpin baru
     * 
     * @param Permit $permit Izin POLSUS yang telah disetujui
     * @param Person $person Pemegang kartu (Satpol PP, PPNS, Satpam, dll)
     * @param Weapon $weapon Senjata api nonorganik yang dipinjamkan
     * @param \DateTime $issueDate Tanggal penerbitan kartu
     * @param \DateTime $expiryDate Tanggal kadaluarsa kartu
     * @return KartuPengpin
     */
    public function execute(
        Permit $permit,
        Person $person,
        Weapon $weapon,
        \DateTime $issueDate,
        \DateTime $expiryDate
    ): KartuPengpin {
        // Generate pengpin number
        $yearMonth = $issueDate->format('Ym');
        $sequence = str_pad(
            KartuPengpin::where('pengpin_number', 'like', "PENGPIN-{$yearMonth}-%")
                ->count() + 1,
            4,
            '0',
            STR_PAD_LEFT
        );
        $pengpinNumber = "PENGPIN-{$yearMonth}-{$sequence}";

        return KartuPengpin::create([
            'permit_id' => $permit->id,
            'person_id' => $person->id,
            'weapon_id' => $weapon->id,
            'pengpin_number' => $pengpinNumber,
            'issue_date' => $issueDate,
            'expiry_date' => $expiryDate,
            'job_title' => $person->job_title ?? '',
            'home_address' => $person->address ?? '',
            'buku_pas_reference' => $person->buku_pas_number ?? null,
            'status' => KartuPengpinStatus::ACTIVE,
        ]);
    }

    /**
     * Cabut Kartu Pengpin
     * 
     * Mencabut kartu izin penguasaan senjata api dengan alasan tertentu
     * (misalnya: berakhir tugas, pelanggaran, dll)
     * 
     * @param KartuPengpin $kartuPengpin
     * @param string $reason Alasan pencabutan
     * @return void
     */
    public function revoke(KartuPengpin $kartuPengpin, string $reason): void
    {
        $kartuPengpin->update([
            'status' => KartuPengpinStatus::REVOKED,
            'revoked_at' => now(),
            'revoked_by' => Auth::id(),
            'revoke_reason' => $reason,
        ]);
    }

    /**
     * Tangguhkan Kartu Pengpin
     * 
     * Menangguhkan kartu sementara waktu (misalnya: dalam investigasi)
     * 
     * @param KartuPengpin $kartuPengpin
     * @param string $reason Alasan penangguhan
     * @return void
     */
    public function suspend(KartuPengpin $kartuPengpin, string $reason): void
    {
        $kartuPengpin->update([
            'status' => KartuPengpinStatus::SUSPENDED,
            'revoke_reason' => $reason,
        ]);
    }
}
