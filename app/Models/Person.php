<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $table = 'persons';

    protected $fillable = [
        'national_id',
        'full_name',
        'birth_date',
        'gender',
        'job_title',
        'rank',
        'address',
        'city',
        'province',
        'police_unit_id',
        'organization_id',
        'photo_path',
        'ktp_number',
        'npwp_number',
        'buku_pas_number',
        'buku_pas_issued_at',
        'buku_pas_expired_at',
        'kartu_ikhsa_takha_number',
        'kartu_ikhsa_ikhsa_number',
        'kartu_ikhsa_issued_at',
        'kartu_ikhsa_expired_at',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'buku_pas_issued_at' => 'date',
        'buku_pas_expired_at' => 'date',
        'kartu_ikhsa_issued_at' => 'date',
        'kartu_ikhsa_expired_at' => 'date',
    ];

    public function policeUnit()
    {
        return $this->belongsTo(PoliceUnit::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function applicants()
    {
        return $this->hasMany(Applicant::class);
    }

    public function testResults()
    {
        return $this->hasMany(TestResult::class);
    }

    public function kartuPengpin()
    {
        return $this->hasMany(KartuPengpin::class);
    }

    public function organizationRepresentatives()
    {
        return $this->hasMany(OrganizationRepresentative::class);
    }

    public function weaponOwnershipHistory()
    {
        return $this->hasMany(WeaponOwnershipHistory::class, 'owner_person_id');
    }

    // Accessors
    public function getIsBukuPasExpiredAttribute(): bool
    {
        return $this->buku_pas_expired_at && $this->buku_pas_expired_at->isPast();
    }

    public function getIsKartuIkhsaExpiredAttribute(): bool
    {
        return $this->kartu_ikhsa_expired_at && $this->kartu_ikhsa_expired_at->isPast();
    }

    public function getHasValidTestResultsAttribute(): bool
    {
        $requiredTests = ['health', 'psychology', 'shooting'];
        $validTests = $this->testResults()
            ->whereIn('test_type', $requiredTests)
            ->where('result', 'pass')
            ->where('expiry_date', '>', now())
            ->pluck('test_type');

        return count($requiredTests) === $validTests->count();
    }
}
