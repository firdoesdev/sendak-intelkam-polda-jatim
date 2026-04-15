# FSD — SENDAK: Sistem Intelkam Polda Jatim
**Functional Specification Document**
**Versi**: 1.0
**Tanggal**: 15 April 2026
**Status**: Draft

---

## 1. Gambaran Umum Arsitektur Sistem

### Tech Stack
| Layer | Teknologi |
|---|---|
| Backend | PHP 8.4 + Laravel 13 |
| Frontend | React 19 + TypeScript 5.7 + Inertia.js 2 |
| UI Components | Tailwind CSS 4 + Radix UI |
| Database | PostgreSQL (DB: `sendak`) |
| Queue | Redis |
| Session & Cache | Database |
| Auth | Laravel Fortify + Spatie Laravel Permission |
| Audit | Spatie Laravel Activitylog |
| File Storage | Local disk private (`permits`) |
| HTTP Server | Laravel Octane (production), Sail (dev) |

### Pola Arsitektur
- **Thin Controller**: Controller hanya menerima request dan mengembalikan response
- **Action Classes**: Logika bisnis dienkapsulasi di `app/Actions/` (satu class per operasi)
- **Form Request**: Validasi input di `app/Http/Requests/`
- **Policy**: Otorisasi per model di `app/Policies/`
- **Service**: Logika kompleks reusable di `app/Services/` (contoh: `PermitValidationService`)
- **Enum PHP 8.1+**: Tipe data terbatas didefinisikan sebagai enum (`app/Enums/`)
- **Inertia + Wayfinder**: Route TypeScript dihasilkan otomatis via `php artisan wayfinder:generate`

---

## 2. Skema Database Lengkap

### 2.1 Diagram Entitas (ERD Ringkas)

```
PoliceUnit ─────┬──── PoliceUnit (parent, self-ref hierarki)
                ├──── User
                ├──── Person
                └──── Warehouse

Division ───────┬──── User (default_division)
                └──── Permit

User ────────────── Role (via Spatie model_has_roles)
Role ────────────── Permission (via Spatie role_has_permissions)

Organization ───┬──── Person
                ├──── Warehouse
                └──── OrganizationRepresentative ── Person

Person ──────────── Applicant
Organization ────── Applicant

Applicant ──────────── Permit (has_many)

Permit ──────────┬──── Division
                 ├──── Applicant
                 ├──── PermitDocument (has_many)
                 ├──── PermitRenewal (has_many)
                 ├──── ExplosivesMaterial (has_many, HANDAK only)
                 ├──── KartuPengpin (has_many, POLSUS only)
                 └──── Weapon (M:N via permit_weapons)

Weapon ──────────┬──── Warehouse
                 ├──── WeaponMovement (has_many)
                 ├──── WeaponTransferRequest (has_many)
                 ├──── WeaponHibahTransferRequest (has_many)
                 ├──── WeaponOwnershipHistory (has_many)
                 └──── KartuPengpin (has_many)

KartuPengpin ───┬──── Permit
                ├──── Person
                └──── Weapon

Person ──────────── TestResult (has_many)
```

### 2.2 Definisi Tabel Lengkap

#### Tabel: `users`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK, auto-increment | |
| police_unit_id | bigint | FK → police_units, nullable | Satuan kepolisian user |
| default_division_id | bigint | FK → divisions, nullable | Divisi default login |
| user_type | varchar | enum: internal/external | |
| name | varchar(255) | NOT NULL | |
| email | varchar(255) | UNIQUE, NOT NULL | |
| email_verified_at | timestamp | nullable | |
| password | varchar(255) | NOT NULL | bcrypt hash |
| two_factor_secret | text | nullable | |
| two_factor_recovery_codes | text | nullable | |
| two_factor_confirmed_at | datetime | nullable | |
| remember_token | varchar(100) | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `divisions`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| code | varchar | UNIQUE | SENPI, POLSUS, HANDAK, SPORT |
| name | varchar | NOT NULL | |
| description | text | nullable | |
| is_active | boolean | default true | |
| created_at / updated_at | timestamp | | |

#### Tabel: `police_units`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| code | varchar | UNIQUE | |
| name | varchar | NOT NULL | |
| unit_type | varchar | enum: POLDA/POLRES/POLSEK | |
| region | varchar | nullable | Nama wilayah |
| address | text | nullable | |
| parent_id | bigint | FK → police_units, nullable | Hierarki atasan |
| is_active | boolean | default true | |
| created_at / updated_at | timestamp | | |

#### Tabel: `organizations`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| name | varchar | NOT NULL | |
| org_type | varchar | enum: company/club/government/other | |
| registration_no | varchar | nullable | NIB / SIUP |
| tax_no | varchar | nullable | NPWP |
| address | text | nullable | |
| city | varchar | nullable | |
| province | varchar | nullable | |
| email | varchar | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `persons`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| national_id | varchar | nullable | NIK / NRP |
| full_name | varchar | NOT NULL | |
| birth_date | date | nullable | |
| gender | varchar | enum: male/female/unknown | |
| job_title | varchar | nullable | |
| rank | varchar | nullable | Pangkat Polri |
| address | text | nullable | |
| city | varchar | nullable | |
| province | varchar | nullable | |
| police_unit_id | bigint | FK → police_units, nullable | |
| organization_id | bigint | FK → organizations, nullable | |
| photo_path | varchar | nullable | |
| ktp_number | varchar | nullable | |
| npwp_number | varchar | nullable | |
| buku_pas_number | varchar | nullable | Buku pas senpi |
| buku_pas_issued_at | date | nullable | |
| buku_pas_expired_at | date | nullable | |
| kartu_ikhsa_takha_number | varchar | nullable | |
| kartu_ikhsa_ikhsa_number | varchar | nullable | |
| kartu_ikhsa_issued_at | date | nullable | |
| kartu_ikhsa_expired_at | date | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `applicants`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| applicant_type | varchar | enum: person/organization | |
| person_id | bigint | FK → persons, nullable | |
| organization_id | bigint | FK → organizations, nullable | |
| display_name | varchar | NOT NULL | Diisi otomatis |
| created_at / updated_at | timestamp | | |

#### Tabel: `permits`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| permit_number | varchar | UNIQUE, nullable | Diisi saat approve |
| division_id | bigint | FK → divisions, NOT NULL | |
| applicant_id | bigint | FK → applicants, NOT NULL | |
| permit_type | varchar | NOT NULL | SENPI/POLSUS/HANDAK/SPORT |
| status | varchar | enum: draft/pending/approved/rejected/expired/cancelled | |
| recommendation_type | varchar | nullable | P1/P2/P3/IJIN_GUDANG |
| activity_type | varchar | nullable | storage/usage/application (HANDAK) |
| submitted_at | timestamp | nullable | |
| approved_at | timestamp | nullable | |
| valid_from | date | nullable | |
| valid_to | date | nullable | |
| last_notified_at | timestamp | nullable | |
| notification_count | integer | default 0 | |
| created_by | bigint | FK → users | |
| updated_by | bigint | FK → users | |
| created_at / updated_at | timestamp | | |

**Logika valid_to berdasarkan recommendation_type:**
| Tipe | Durasi |
|---|---|
| P1 | 180 hari dari approved_at |
| P2 | 365 hari dari approved_at |
| P3 | 90 hari dari approved_at |
| IJIN_GUDANG | 730 hari dari approved_at |

**Format nomor izin:** `{PERMIT_TYPE}-{YYYYMM}-{XXXX}` (contoh: `SENPI-202604-0001`)

#### Tabel: `warehouses`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| code | varchar | UNIQUE | |
| name | varchar | NOT NULL | |
| storage_type | varchar | enum: POLICE_UNIT/HANDAK_WAREHOUSE/PERBAKIN | |
| police_unit_id | bigint | FK → police_units, nullable | |
| organization_id | bigint | FK → organizations, nullable | |
| address | text | nullable | |
| city | varchar | nullable | |
| province | varchar | nullable | |
| latitude | decimal(10,7) | nullable | |
| longitude | decimal(10,7) | nullable | |
| capacity_kg | decimal(10,2) | nullable | Kapasitas HANDAK |
| current_load_kg | decimal(10,2) | default 0 | Beban saat ini |
| is_active | boolean | default true | |
| created_at / updated_at | timestamp | | |

#### Tabel: `weapons`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| code | varchar | UNIQUE | |
| name | varchar | NOT NULL | |
| permit_type | varchar | NOT NULL | SENPI/POLSUS/HANDAK/SPORT |
| weapon_type | varchar | nullable | Pistol, Rifle, Baton, dll |
| serial_number | varchar | UNIQUE | |
| manufacturer | varchar | nullable | |
| caliber | varchar | nullable | |
| acquisition_date | date | nullable | |
| acquisition_type | varchar | NOT NULL | new / hibah |
| condition | varchar | enum: new/excellent/good/fair/poor/damaged | |
| status | varchar | enum: available/issued/maintenance/decommissioned | |
| warehouse_id | bigint | FK → warehouses | |
| previous_owner_id | bigint | FK → persons, nullable | Pemilik sebelumnya (jika hibah) |
| previous_owner_permit_id | bigint | FK → permits, nullable | |
| transfer_date | date | nullable | |
| import_permit_document_id | bigint | FK → permit_documents, nullable | |
| notes | text | nullable | |
| is_active | boolean | default true | |
| created_at / updated_at | timestamp | | |

#### Tabel: `weapon_movements`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| weapon_id | bigint | FK → weapons, NOT NULL | |
| movement_type | varchar | enum: check_in/check_out/transfer/maintenance/return_from_maintenance/disposal | |
| from_warehouse_id | bigint | FK → warehouses, nullable | |
| to_warehouse_id | bigint | FK → warehouses, nullable | |
| permit_id | bigint | FK → permits, nullable | |
| person_id | bigint | FK → persons, nullable | |
| moved_by | bigint | FK → users | |
| moved_at | timestamp | NOT NULL | |
| notes | text | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `permit_weapons` (pivot)
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| permit_id | bigint | FK → permits, NOT NULL | |
| weapon_id | bigint | FK → weapons, NOT NULL | |
| issued_at | timestamp | NOT NULL | |
| returned_at | timestamp | nullable | NULL = masih aktif dipinjam |
| condition_on_issue | varchar | enum kondisi | |
| condition_on_return | varchar | enum kondisi, nullable | |
| notes | text | nullable | |
| created_at / updated_at | timestamp | | |
| **UNIQUE** | (weapon_id, returned_at) | | Mencegah double-issue senjata |

#### Tabel: `weapon_transfer_requests`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| request_number | varchar | UNIQUE, nullable | Format: TRF-YYYYMM-XXXX |
| weapon_id | bigint | FK → weapons | |
| from_warehouse_id | bigint | FK → warehouses | |
| to_warehouse_id | bigint | FK → warehouses | |
| status | varchar | enum: draft/pending/approved/rejected | |
| reason | text | nullable | |
| requested_by | bigint | FK → users | |
| submitted_at | timestamp | nullable | |
| approved_by | bigint | FK → users, nullable | |
| approved_at | timestamp | nullable | |
| rejection_reason | text | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `weapon_hibah_transfer_requests`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| request_number | varchar | nullable | Format: HIBAH-YYYYMM-XXXX |
| weapon_id | bigint | FK → weapons | |
| from_owner_id | bigint | FK → persons | Pemilik lama |
| to_owner_id | bigint | FK → persons | Pemilik baru |
| to_permit_id | bigint | FK → permits, nullable | Izin POLSUS penerima |
| status | varchar | draft/pending/approved/rejected | |
| transfer_document_id | bigint | FK → permit_documents, nullable | |
| requested_by | bigint | FK → users | |
| submitted_at | timestamp | nullable | |
| approved_by | bigint | FK → users, nullable | |
| approved_at | timestamp | nullable | |
| rejection_reason | text | nullable | |
| notes | text | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `weapon_ownership_history`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| weapon_id | bigint | FK → weapons | |
| owner_person_id | bigint | FK → persons | |
| permit_id | bigint | FK → permits, nullable | |
| owned_from | date | NOT NULL | |
| owned_to | date | nullable | NULL = pemilik aktif saat ini |
| transfer_type | varchar | nullable | hibah, dll |
| notes | text | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `permit_renewals`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| renewal_number | varchar | nullable | Format: RNW-YYYYMM-XXXX |
| permit_id | bigint | FK → permits | |
| current_valid_to | date | NOT NULL | Tanggal berlaku lama |
| new_valid_to | date | NOT NULL | Tanggal berlaku baru |
| status | varchar | enum: draft/pending/approved/rejected | |
| reason | text | nullable | |
| requested_by | bigint | FK → users | |
| submitted_at | timestamp | nullable | |
| approved_by | bigint | FK → users, nullable | |
| approved_at | timestamp | nullable | |
| rejection_reason | text | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `permit_documents`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| permit_id | bigint | FK → permits | |
| document_type | varchar | NOT NULL | Lihat enum di bawah |
| file_path | varchar | NOT NULL | Path relatif di disk `permits` |
| file_size | unsignedInteger | NOT NULL | Ukuran dalam bytes |
| mime_type | varchar | NOT NULL | |
| original_filename | varchar | NOT NULL | |
| uploaded_by | bigint | FK → users | |
| created_at / updated_at | timestamp | | |

**Enum document_type:**
`ktp`, `npwp`, `ksk`, `skep_jabatan`, `kta`, `import_permit`, `health_test`, `psych_test`, `shooting_test`, `surat_hibah`, `other`

#### Tabel: `kartu_pengpin`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| pengpin_number | varchar | UNIQUE | Format: PENGPIN-YYYYMM-XXXX |
| permit_id | bigint | FK → permits | Harus tipe POLSUS |
| person_id | bigint | FK → persons | Pemegang kartu |
| weapon_id | bigint | FK → weapons | Senjata nonorganik |
| issue_date | date | NOT NULL | |
| expiry_date | date | NOT NULL | |
| job_title | varchar | NOT NULL | |
| home_address | text | NOT NULL | |
| buku_pas_reference | varchar | nullable | |
| status | varchar | enum: active/expired/revoked/suspended | |
| revoked_at | timestamp | nullable | |
| revoked_by | bigint | FK → users, nullable | |
| revoke_reason | text | nullable | |
| created_at / updated_at | timestamp | | |
| **UNIQUE** | (permit_id, person_id, weapon_id) | | |

#### Tabel: `explosives_materials`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| permit_id | bigint | FK → permits | Harus tipe HANDAK |
| material_type | varchar | NOT NULL | Jenis bahan peledak |
| item_name | varchar | NOT NULL | |
| weight | decimal(10,2) | NOT NULL | |
| quantity | integer | NOT NULL | |
| unit | varchar | default `kg` | |
| notes | text | nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel: `test_results`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| person_id | bigint | FK → persons | |
| test_type | varchar | NOT NULL | health / psychology / shooting |
| test_date | date | NOT NULL | |
| expiry_date | date | NOT NULL | |
| result | varchar | NOT NULL | pass / fail |
| score | integer | nullable | |
| certificate_document_id | bigint | FK → permit_documents, nullable | |
| issued_by | varchar | nullable | |
| notes | text | nullable | |
| **UNIQUE** | (person_id, test_type) | | Satu jenis tes aktif per person |
| created_at / updated_at | timestamp | | |

#### Tabel: `organization_representatives`
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | bigint | PK | |
| organization_id | bigint | FK → organizations | |
| person_id | bigint | FK → persons | |
| active_from | date | NOT NULL | |
| active_to | date | nullable | NULL = aktif saat ini |
| appointment_document_id | bigint | FK → permit_documents, nullable | |
| created_at / updated_at | timestamp | | |

#### Tabel-tabel Spatie & Laravel Standar
| Tabel | Fungsi |
|---|---|
| `roles` | Definisi role RBAC |
| `permissions` | Definisi permission RBAC |
| `model_has_roles` | Pivot User ↔ Role |
| `model_has_permissions` | Pivot User ↔ Permission langsung |
| `role_has_permissions` | Pivot Role ↔ Permission |
| `activity_log` | Audit trail semua perubahan |
| `notifications` | Notifikasi database (uuid PK) |
| `sessions` | Session database |
| `jobs` | Queue jobs |
| `cache` | Cache store |
| `password_reset_tokens` | Token reset password |

---

## 3. Alur Proses Bisnis (Business Flow)

### 3.1 Alur Perizinan

```
[Staff] Buat Draft Izin
    │
    ├── Pilih: Division, Applicant, Permit Type, Recommendation Type
    ├── Upload dokumen pendukung (opsional di tahap draft)
    │
    ▼
[Staff] Submit (Draft → Pending)
    │
    ├── Validasi PermitValidationService:
    │   ├── KTP person ada?
    │   ├── NPWP ada? (wajib untuk HANDAK)
    │   ├── Tes kesehatan/psikologi/menembak: lulus & belum expired?
    │   ├── Buku PAS belum expired? (SENPI, POLSUS)
    │   └── Kapasitas gudang HANDAK: warning >90%, error >100%
    │
    ▼
[Supervisor] Review → Approve / Reject
    │
    ├── Approve:
    │   ├── permit_number digenerate otomatis
    │   ├── approved_at = now()
    │   ├── valid_from = now(), valid_to = now() + durasi rekomendasi
    │   └── status = approved
    │
    └── Reject:
        └── status = rejected (dapat diajukan ulang sebagai draft baru)
    │
    ▼
[Scheduler Harian] Cek Expired
    └── Jika today > valid_to → status = expired
```

### 3.2 Alur Perpanjangan Izin

```
[Staff] Buat Renewal (hanya jika permit EXPIRED, max 60 hari setelah/sebelum expired)
    │
    ├── new_valid_to = permit.valid_to + perpanjangan (max +1 tahun)
    │
    ▼
[Staff] Submit (Draft → Pending)
    │
    ▼
[Supervisor] Approve / Reject
    │
    └── Approve:
        ├── permit.valid_to = renewal.new_valid_to
        ├── permit.status = approved (kembali aktif)
        ├── permit.notification_count = 0
        └── permit.last_notified_at = null
```

### 3.3 Alur Transfer Senjata Antar Gudang

```
[Staff] Buat Transfer Request (weapon harus available)
    │
    ▼
[Staff] Submit (Draft → Pending)
    │
    ▼
[Supervisor] Approve / Reject
    │
    └── Approve:
        ├── weapon.warehouse_id = to_warehouse_id
        └── WeaponMovement dibuat (type: transfer)
```

### 3.4 Alur Hibah Transfer (Perpindahan Kepemilikan)

```
[Staff] Buat Hibah Transfer Request
    ├── Pilih: weapon, from_owner, to_owner, to_permit (POLSUS)
    ├── Upload: surat_hibah (dokumen)
    │
    ▼
[Staff] Submit (Draft → Pending)
    │
    ▼
[Supervisor] Approve / Reject
    │
    └── Approve:
        ├── WeaponOwnershipHistory: owned_to diisi untuk record lama
        ├── WeaponOwnershipHistory: record baru dibuat untuk to_owner
        └── weapon.acquisition_type = hibah
```

### 3.5 Alur Kartu Pengpin (POLSUS)

```
[Staff POLSUS] Buat Kartu Pengpin
    ├── Pilih: permit (POLSUS), person, weapon
    ├── Isi: job_title, home_address, issue_date, expiry_date
    │
    ▼
Kartu Pengpin aktif → dapat dicetak
    │
    ├── [Scheduler Harian] kartu-pengpin:expire
    │   └── Jika today > expiry_date → status = expired
    │
    ├── [Scheduler Harian] kartu-pengpin:notify-expiring --days=30
    │   └── Kirim notifikasi email + database ke pemegang
    │
    └── [Supervisor] Revoke (status = revoked + revoke_reason)
```

---

## 4. Daftar Endpoint API / Routes

### Authentication (Fortify)
| Method | Path | Fungsi |
|---|---|---|
| GET/POST | `/login` | Form & proses login |
| POST | `/logout` | Logout |
| GET/POST | `/register` | Form & proses registrasi |
| GET/POST | `/forgot-password` | Lupa password |
| GET/POST | `/reset-password` | Reset password |
| GET | `/email/verify` | Halaman verifikasi email |
| POST | `/email/verify/{id}/{hash}` | Proses verifikasi email |
| GET/POST | `/user/two-factor-authentication` | Manage 2FA |
| GET | `/user/two-factor-qr-code` | QR code 2FA |
| POST | `/user/two-factor-challenge` | Verifikasi kode 2FA saat login |

### Dashboard
| Method | Path | Fungsi |
|---|---|---|
| GET | `/dashboard` | Halaman utama (belum ada konten analytics) |

### Settings
| Method | Path | Fungsi |
|---|---|---|
| GET/PUT | `/settings/profile` | Edit profil user |
| GET/PUT | `/settings/password` | Ganti password |
| GET/POST/DELETE | `/settings/two-factor` | Kelola 2FA |

### IAM — Identity & Access Management
| Method | Path | Fungsi |
|---|---|---|
| GET | `/iam/users` | Daftar user |
| POST | `/iam/users` | Buat user baru |
| GET | `/iam/users/{user}` | Detail user |
| PUT | `/iam/users/{user}` | Update user |
| DELETE | `/iam/users/{user}` | Hapus user |
| POST | `/iam/users/{user}/roles` | Assign role ke user |
| GET | `/iam/roles` | Daftar role |
| POST | `/iam/roles` | Buat role baru |
| GET | `/iam/roles/{role}` | Detail role |
| PUT | `/iam/roles/{role}` | Update role |
| DELETE | `/iam/roles/{role}` | Hapus role |
| POST | `/iam/roles/{role}/permissions` | Assign permission ke role |
| GET | `/iam/permissions` | Daftar permission |
| POST | `/iam/permissions` | Buat permission baru |
| PUT | `/iam/permissions/{permission}` | Update permission |
| DELETE | `/iam/permissions/{permission}` | Hapus permission |

### Master Data
| Method | Path | Fungsi |
|---|---|---|
| GET/POST | `/master-data/police-units` | Index + buat satuan kepolisian |
| GET/PUT/DELETE | `/master-data/police-units/{policeUnit}` | Detail/update/hapus |
| GET/POST | `/master-data/warehouses` | Index + buat gudang |
| GET/PUT/DELETE | `/master-data/warehouses/{warehouse}` | Detail/update/hapus |
| GET/POST | `/master-data/organizations` | Index + buat organisasi |
| GET/PUT/DELETE | `/master-data/organizations/{organization}` | Detail/update/hapus |
| GET/POST | `/master-data/applicants` | Index + buat pemohon |
| GET/PUT/DELETE | `/master-data/applicants/{applicant}` | Detail/update/hapus |
| GET/POST | `/master-data/persons` | Index + buat data orang |
| GET/PUT/DELETE | `/master-data/persons/{person}` | Detail/update/hapus |

### Perizinan
| Method | Path | Fungsi |
|---|---|---|
| GET | `/permits` | Daftar izin (filter per divisi user) |
| POST | `/permits` | Buat izin baru |
| GET | `/permits/{permit}` | Detail izin |
| PUT | `/permits/{permit}` | Update izin |
| DELETE | `/permits/{permit}` | Hapus izin (hanya draft) |
| POST | `/permits/{permit}/documents` | Upload dokumen ke izin |
| GET | `/documents/{document}/download` | Download dokumen |
| DELETE | `/documents/{document}` | Hapus dokumen |
| GET/POST | `/renewals-permits` | Daftar + buat perpanjangan |
| POST | `/renewals-permits/{id}/approve` | Setujui perpanjangan |
| POST | `/renewals-permits/{id}/reject` | Tolak perpanjangan |
| GET/POST | `/kartu-pengpin` | Daftar + buat Kartu Pengpin |
| GET | `/kartu-pengpin/{kartuPengpin}` | Detail Kartu Pengpin |
| GET | `/kartu-pengpin/{kartuPengpin}/print` | Halaman cetak Kartu Pengpin |
| POST | `/kartu-pengpin/{kartuPengpin}/revoke` | Cabut Kartu Pengpin |

### Senjata
| Method | Path | Fungsi |
|---|---|---|
| GET | `/weapons` | Daftar senjata |
| POST | `/weapons` | Tambah senjata baru |
| GET | `/weapons/{weapon}` | Detail senjata |
| PUT | `/weapons/{weapon}` | Update data senjata |
| DELETE | `/weapons/{weapon}` | Hapus senjata |
| GET/POST | `/transfer-requests` | Daftar + buat permintaan transfer |
| POST | `/transfer-requests/{id}/approve` | Setujui transfer |
| POST | `/transfer-requests/{id}/reject` | Tolak transfer |
| GET/POST | `/hibah-transfers` | Daftar + buat hibah transfer |
| GET | `/hibah-transfers/{transfer}` | Detail hibah transfer |
| POST | `/hibah-transfers/{transfer}/submit` | Submit hibah transfer |
| POST | `/hibah-transfers/{transfer}/approve` | Setujui hibah transfer |

---

## 5. Aturan Bisnis (Business Rules)

### Perizinan
| ID | Aturan |
|---|---|
| BR-P01 | Izin hanya dapat di-submit jika semua validasi `PermitValidationService` lulus |
| BR-P02 | Nomor izin di-generate otomatis saat approve dengan format `{TYPE}-{YYYYMM}-{XXXX}` |
| BR-P03 | Hanya izin berstatus DRAFT yang dapat dihapus |
| BR-P04 | User hanya dapat mengedit izin dari divisi default-nya sendiri |
| BR-P05 | HANDAK wajib memiliki NPWP dan data ExplosivesMaterial |
| BR-P06 | Durasi berlaku ditentukan oleh recommendation_type: P1=180 hari, P2=365 hari, P3=90 hari, IJIN_GUDANG=730 hari |

### Perpanjangan
| ID | Aturan |
|---|---|
| BR-RN01 | Perpanjangan hanya dapat diajukan untuk izin dengan status EXPIRED |
| BR-RN02 | Pengajuan hanya valid dalam window 60 hari sebelum atau sesudah tanggal expired |
| BR-RN03 | Maksimum perpanjangan adalah 1 tahun dari valid_to terakhir |
| BR-RN04 | Setelah disetujui, status izin kembali menjadi APPROVED dan notification_count di-reset |

### Senjata
| ID | Aturan |
|---|---|
| BR-W01 | Senjata hanya dapat di-issue ke izin jika statusnya `available` |
| BR-W02 | Satu senjata hanya dapat dipinjamkan ke satu izin aktif pada waktu yang sama (unique: weapon_id + returned_at=null) |
| BR-W03 | Transfer gudang harus melalui approval Supervisor |
| BR-W04 | Setelah transfer disetujui, WeaponMovement dengan type `transfer` otomatis dibuat |

### Hibah Transfer
| ID | Aturan |
|---|---|
| BR-HT01 | Hibah transfer harus menyertakan dokumen surat_hibah |
| BR-HT02 | Izin tujuan (to_permit) harus bertipe POLSUS |
| BR-HT03 | Setelah disetujui, riwayat kepemilikan lama ditutup (owned_to diisi), dan record baru dibuat |

### Kartu Pengpin
| ID | Aturan |
|---|---|
| BR-KP01 | Satu kombinasi permit + person + weapon hanya bisa memiliki satu Kartu Pengpin aktif |
| BR-KP02 | Kartu Pengpin hanya dapat dibuat untuk izin bertipe POLSUS |
| BR-KP03 | Notifikasi dikirim 30 hari sebelum expiry_date (via scheduled command) |
| BR-KP04 | Revoke memerlukan revoke_reason yang tidak boleh kosong |

### Validasi Pemohon (PermitValidationService)
| ID | Aturan |
|---|---|
| BR-PV01 | Person wajib memiliki nomor KTP |
| BR-PV02 | Person wajib memiliki NPWP untuk izin HANDAK |
| BR-PV03 | Tes kesehatan, psikologi, dan menembak wajib ada, hasilnya 'pass', dan belum expired |
| BR-PV04 | Buku PAS tidak boleh expired (SENPI, POLSUS) |
| BR-PV05 | Kartu Ikhsa tidak boleh expired (SENPI, SPORT) |
| BR-PV06 | Kapasitas gudang HANDAK: warning jika > 90%, tolak jika > 100% |

---

## 6. Aturan Otorisasi (RBAC)

### Role & Hak Akses
| Role | Deskripsi Umum |
|---|---|
| admin | Akses penuh semua fitur termasuk IAM |
| supervisor | Approve/reject semua proses; tidak bisa kelola user |
| staff | Buat dan kelola record sesuai divisi |
| viewer | Hanya baca |

### Permission List (yang sudah di-seed)
| Permission | Deskripsi |
|---|---|
| create_hibah_transfer | Membuat permintaan hibah transfer |
| approve_hibah_transfer | Menyetujui/menolak hibah transfer |
| manage_hibah_transfer | Akses penuh hibah transfer |
| create_kartu_pengpin | Menerbitkan Kartu Pengpin |
| revoke_kartu_pengpin | Mencabut Kartu Pengpin |
| manage_kartu_pengpin | Akses penuh Kartu Pengpin |
| manage_permit_documents | Upload/hapus dokumen perizinan |

### Permission yang Belum Di-seed (Perlu Ditambahkan)
| Permission | Digunakan Di |
|---|---|
| view-permits | PermitPolicy@view |
| create-permits | PermitPolicy@create |
| edit-permits | PermitPolicy@update |
| delete-permits | PermitPolicy@delete |
| request-permit-renewals | PermitController (Gate::allows) |

> **Catatan**: Ada inkonsistensi naming — permission yang sudah di-seed menggunakan `snake_case` (underscore), sedangkan permission Permit menggunakan `kebab-case` (dash). Perlu distandarisasi.

---

## 7. Modul & Status Implementasi

### Modul yang Selesai ✅

| Modul | File Kunci |
|---|---|
| Login + Logout + 2FA | `app/Actions/Fortify/`, `routes/web.php` |
| IAM (User/Role/Permission) | `app/Actions/IAM/`, `routes/iam.php` |
| Master Data (PoliceUnit, Warehouse, Organization, Person, Applicant) | `app/Actions/MasterData/`, `routes/master-data.php` |
| CRUD Perizinan + Upload Dokumen | `app/Actions/Permits/`, `routes/permits.php` |
| Kartu Pengpin (Buat + Cetak + Revoke) | `app/Actions/Permits/KartuPengpin/` |
| Transfer Senjata Antar Gudang | `app/Actions/Weapons/` |
| Hibah Transfer Kepemilikan Senjata | `app/Actions/Weapons/` |
| Audit Trail (Spatie Activitylog) | Model: `Permit`, `Weapon`, `KartuPengpin` |
| Auto-expire Permit (Scheduler) | `app/Console/Commands/CheckAndUpdateToExpired` |

### Modul Partially Done ⚠️

| Modul | Kekurangan |
|---|---|
| Perpanjangan Izin | Filter per divisi user belum diterapkan di `ListPermitRenewal`; notifikasi approval belum aktif |
| Notifikasi | Infrastruktur ada (tabel + class); notifikasi untuk permit/renewal/transfer masih di-comment/TODO |
| Weapon Permission | `WeaponStoreRequest`, `WeaponUpdateRequest`, `TransferRequestStoreRequest` masih `return true` di `authorize()` |
| Scheduler Kartu Pengpin | Command `ExpireKartuPengpin` dan `NotifyExpiringKartuPengpin` ada tapi belum terdaftar di `console.php` |

### Modul Belum Ada ❌

| Modul | Keterangan |
|---|---|
| Test Results UI | Model `TestResult` + migration ada; belum ada route/controller/halaman |
| Organization Representatives UI | Model + migration ada; belum ada route/controller/halaman |
| Dashboard Analytics | Recharts terinstall; belum ada halaman analytics/statistik |
| Permission Seed Permit | Permission `view-permits`, `create-permits`, dll belum di-seed |

---

## 8. Scheduler / Cron Jobs

| Command | Jadwal Saat Ini | Seharusnya |
|---|---|---|
| `CheckAndUpdateToExpired` | Terdaftar di console.php (harian, Asia/Jakarta) | ✅ Sudah benar |
| `kartu-pengpin:expire` | **Belum terdaftar** | Harian, 00:01 WIB |
| `kartu-pengpin:notify-expiring --days=30` | **Belum terdaftar** | Harian, 08:00 WIB |

**Perlu ditambahkan di `routes/console.php`:**
```php
Schedule::command('kartu-pengpin:expire')->dailyAt('00:01')->timezone('Asia/Jakarta');
Schedule::command('kartu-pengpin:notify-expiring', ['--days' => 30])->dailyAt('08:00')->timezone('Asia/Jakarta');
```

---

## 9. Konfigurasi File & Storage

### Disk Configuration
- Nama disk: `permits`
- Tipe: local (private, tidak bisa diakses langsung via URL publik)
- Path: `storage/app/permits/`
- Akses: hanya melalui controller `DocumentController` dengan route `/documents/{document}/download`

### Batasan Upload
- Ukuran maksimum: 2MB per file
- Format yang diizinkan: PDF, JPG, JPEG, PNG
- Validasi di `PermitDocumentStoreRequest`

---

## 10. Notifikasi

### KartuPengpin Expiring
- **Class**: `app/Notifications/KartuPengpinExpiringNotification`
- **Channel**: email + database
- **Trigger**: Scheduler `kartu-pengpin:notify-expiring --days=30`
- **Penerima**: User yang membuat Kartu Pengpin
- **Status**: Infrastruktur lengkap, scheduler belum terdaftar

### Permit/Renewal/Transfer (Belum Diimplementasikan)
Berikut titik notifikasi yang perlu ditambahkan:
| Event | File | Status |
|---|---|---|
| Permit status berubah | `app/Actions/Permits/UpdatePermit.php:41` | TODO comment |
| Renewal diajukan (ke approver) | `app/Actions/PermitRenewals/RequestPermitRenewal.php:66` | TODO comment |
| Renewal disetujui/ditolak (ke requester) | `app/Actions/PermitRenewals/ApprovePermitRenewal.php:48` | TODO comment |
| Transfer diajukan (ke approver) | `app/Actions/Weapons/RequestTransferWeapon.php:21` | TODO comment |
| Transfer disetujui/ditolak (ke requester) | `app/Actions/Weapons/ApproveTransferWeapon.php:56` | TODO comment |

---

## 11. Issue & Backlog Teknis

### Critical (Harus Diperbaiki Sebelum Go-Live)

| # | Issue | File | Solusi |
|---|---|---|---|
| C01 | Permission check weapon di-bypass (`return true`) | `WeaponStoreRequest.php:14`, `WeaponUpdateRequest.php:14`, `TransferRequestStoreRequest.php:11` | Implementasikan `authorize()` dengan pengecekan permission yang sesuai |
| C02 | Permission Permit belum di-seed | `database/seeders/PermissionsSeeder.php` | Tambahkan seed: `view-permits`, `create-permits`, `edit-permits`, `delete-permits`, `request-permit-renewals` |
| C03 | Scheduler Kartu Pengpin belum terdaftar | `routes/console.php` | Daftarkan `kartu-pengpin:expire` dan `kartu-pengpin:notify-expiring` |
| C04 | `MAIL_MAILER=log` di production | `.env` | Konfigurasi SMTP (Mailgun/SendGrid/dll) untuk production |

### High (Fungsionalitas Penting Belum Selesai)

| # | Issue | Keterangan |
|---|---|---|
| H01 | Filter perpanjangan izin per divisi belum ada | `ListPermitRenewal.php:16` — perlu filter berdasarkan `user.default_division_id` |
| H02 | Notifikasi approval permit/renewal/transfer belum aktif | Implementasikan 5 titik notifikasi di atas |
| H03 | Test Results belum ada UI | Buat CRUD untuk `test_results` per person (penting untuk validasi perizinan) |
| H04 | Organization Representatives belum ada UI | Buat CRUD untuk perwakilan organisasi |

### Medium (Perbaikan Kualitas)

| # | Issue | Keterangan |
|---|---|---|
| M01 | Inkonsistensi naming permission (dash vs underscore) | Standarisasi semua ke snake_case dan update seeder |
| M02 | Inkonsistensi pesan error perpanjangan | `RequestPermitRenewal.php` — pesan menyebut "status disetujui" padahal logikanya cek EXPIRED |
| M03 | Dashboard belum ada konten analytics | Buat halaman dashboard dengan statistik: total izin aktif, akan expired, dan pergerakan senjata |
| M04 | `DeletePermit` belum ada permission check | Tambahkan cek: hanya permit berstatus DRAFT yang bisa dihapus, dan hanya oleh creator/admin |

### Low (Enhancement)

| # | Issue | Keterangan |
|---|---|---|
| L01 | Landing page belum ada | Route `/` langsung redirect ke login; bisa tambahkan halaman welcome |
| L02 | 2FA belum wajib untuk semua user | Pertimbangkan mewajibkan 2FA untuk role admin dan supervisor |
| L03 | Kapasitas gudang HANDAK tidak auto-update | `current_load_kg` perlu di-update otomatis saat senjata masuk/keluar |

---

## 12. Dependency & Infrastruktur

### PHP Packages Utama
| Package | Versi | Fungsi |
|---|---|---|
| laravel/framework | ^13.5 | Core framework |
| laravel/fortify | ^1.36 | Authentication |
| laravel/octane | ^2.17 | Performance HTTP server |
| laravel/wayfinder | ^0.1.16 | TypeScript route generation |
| spatie/laravel-permission | ^7.3 | RBAC |
| spatie/laravel-activitylog | ^5.0 | Audit trail |

### NPM Packages Utama
| Package | Versi | Fungsi |
|---|---|---|
| react | ^19.2 | UI framework |
| @inertiajs/react | ^2.3 | SPA tanpa API |
| @tanstack/react-table | ^8.21 | Data table |
| react-hook-form | ^7.66 | Form management |
| zod | ^4.1 | Schema validation |
| recharts | ^2.15 | Charts (belum digunakan) |
| @radix-ui/* | latest | Headless UI components |

### Infrastruktur yang Dibutuhkan
- **PostgreSQL** >= 14
- **Redis** >= 6 (untuk queue dan session jika diubah ke redis)
- **PHP** >= 8.4 dengan ekstensi: pdo_pgsql, redis, opcache
- **Node.js** >= 20 (untuk build frontend)
- **SMTP server** untuk email notifications

---

*Dokumen ini dihasilkan dari analisis kode per tanggal 15 April 2026.*
*Perbarui dokumen ini setiap ada perubahan signifikan pada skema atau alur bisnis.*
