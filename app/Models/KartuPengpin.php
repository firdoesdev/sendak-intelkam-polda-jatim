<?php

namespace App\Models;

use App\Enums\KartuPengpinStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Support\LogOptions;

/**
 * Kartu Penguasaan Pinjam Pakai Senjata Api (Nonorganik)
 *
 * Kartu izin resmi yang dikeluarkan Polri melalui Dirintelkam Polda untuk
 * penguasaan sementara senjata api nonorganik (milik TNI/Polri) untuk keperluan
 * tugas keamanan seperti Satpol PP, PPNS, Satpam, dll.
 *
 * Proses: Permohonan izin penguasaan ke Polda dengan melampirkan:
 * - Surat permohonan & surat tugas
 * - Fotokopi KTA/SK
 * - Surat mahir penggunaan senpi
 * - Surat kesehatan & tes psikologi
 * - SKCK dan pasfoto
 *
 * Hanya berlaku untuk izin POLSUS dengan jangka waktu tertentu.
 */
class KartuPengpin extends Model
{
    protected $table = 'kartu_pengpin';

    protected $fillable = [
        'pengpin_number',
        'permit_id',
        'person_id',
        'weapon_id',
        'issue_date',
        'expiry_date',
        'job_title',
        'home_address',
        'buku_pas_reference',
        'status',
        'revoked_at',
        'revoked_by',
        'revoke_reason',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'revoked_at' => 'datetime',
        'status' => KartuPengpinStatus::class,
    ];

    protected $appends = [
        'is_expired',
        'is_active',
        'status_label',
        'status_variant',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'pengpin_number', 'expiry_date', 'revoke_reason'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /**
     * Permit POLSUS yang terkait dengan kartu ini
     */
    public function permit(): BelongsTo
    {
        return $this->belongsTo(Permit::class);
    }

    /**
     * Pemegang kartu (person) - Satpol PP, PPNS, Satpam, dll.
     */
    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

    /**
     * Senjata api nonorganik (milik TNI/Polri) yang dipinjamkan
     */
    public function weapon(): BelongsTo
    {
        return $this->belongsTo(Weapon::class);
    }

    /**
     * Petugas yang mencabut kartu
     */
    public function revokedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revoked_by');
    }

    /**
     * Cek apakah kartu sudah kadaluarsa
     */
    public function isExpired(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->expiry_date && $this->expiry_date->isPast()
        );
    }

    /**
     * Cek apakah kartu masih aktif dan belum kadaluarsa
     */
    public function isActive(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === KartuPengpinStatus::ACTIVE && ! $this->is_expired
        );
    }

    /**
     * Label status untuk tampilan
     */
    public function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status->label()
        );
    }

    /**
     * Variant status untuk styling badge
     */
    public function statusVariant(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status->variant()
        );
    }

    // Backward compatibility accessors

    /**
     * Alias untuk pengpin_number (backward compatibility)
     */
    public function cardNumber(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->pengpin_number
        );
    }

    /**
     * Alias untuk issue_date (backward compatibility)
     */
    public function issuedAt(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->issue_date
        );
    }

    /**
     * Alias untuk expiry_date (backward compatibility)
     */
    public function expiredAt(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->expiry_date
        );
    }
}
