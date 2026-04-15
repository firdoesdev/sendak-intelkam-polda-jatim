# PRD — SENDAK: Sistem Intelkam Polda Jatim
**Product Requirements Document**
**Versi**: 1.0
**Tanggal**: 15 April 2026
**Status**: Draft

---

## 1. Latar Belakang & Konteks Bisnis

Direktorat Intelijen dan Keamanan (Intelkam) Polda Jawa Timur bertanggung jawab atas penerbitan dan pengelolaan perizinan senjata api, bahan peledak, dan izin keamanan khusus di wilayah Jawa Timur. Proses perizinan yang sebelumnya berbasis dokumen fisik dan manual menimbulkan berbagai masalah: sulitnya penelusuran status, rawan kehilangan dokumen, tidak adanya notifikasi otomatis kadaluarsa, dan keterbatasan audit trail.

SENDAK (nama kode proyek) hadir sebagai sistem informasi berbasis web untuk mendigitalisasi, mengotomatisasi, dan memusatkan seluruh proses perizinan Intelkam.

---

## 2. Tujuan Produk

| Tujuan | Metrik Keberhasilan |
|---|---|
| Mengganti proses manual dengan sistem digital | 100% pengajuan izin baru melalui sistem |
| Meningkatkan keterlacakan dokumen perizinan | Semua dokumen tersimpan dan dapat diunduh kapan saja |
| Mengurangi izin kadaluarsa yang tidak terdeteksi | Notifikasi otomatis minimal 30 hari sebelum kadaluarsa |
| Mempercepat proses approval | Target response time approval < 3 hari kerja |
| Menyediakan audit trail lengkap | Semua perubahan data terekam dengan waktu dan pelaku |

---

## 3. Stakeholder & Pengguna

| Peran | Deskripsi | Akses |
|---|---|---|
| **Admin** | Administrator sistem, mengelola user, role, master data | Full access |
| **Supervisor** | Pejabat Intelkam, menyetujui/menolak perizinan | Approve/reject semua proses |
| **Staff** | Staf Intelkam, input dan pengelolaan data | Create & manage records |
| **Viewer** | Pihak yang hanya memantau | Read-only |

### Divisi Internal
| Kode | Nama | Jenis Izin |
|---|---|---|
| SENPI | Senjata Api | Izin kepemilikan/penguasaan senjata api |
| POLSUS | Kepolisian Khusus | Izin petugas keamanan khusus (Satpol PP, PPNS, Satpam) |
| HANDAK | Bahan Peledak | Izin pengelolaan, penyimpanan, dan penggunaan bahan peledak |
| SPORT | Olahraga | Izin kepemilikan senjata api untuk keperluan olahraga menembak |

---

## 4. Ruang Lingkup Produk

### 4.1 In Scope

#### Modul 1 — Autentikasi & Manajemen Akses
- Login / logout dengan email dan password
- Two-Factor Authentication (TOTP)
- Manajemen user, role, dan permission (RBAC)
- User terhubung ke satuan kepolisian dan divisi default
- Email verification & password reset

#### Modul 2 — Master Data
- **Satuan Kepolisian**: Hierarki POLDA > POLRES > POLSEK
- **Gudang Senjata**: Tipe (satuan polisi, gudang HANDAK, PERBAKIN), kapasitas, koordinat GPS
- **Organisasi/Instansi**: Perusahaan, klub, pemerintah
- **Data Orang (Person)**: Identitas lengkap, dokumen, pangkat, foto
- **Pemohon (Applicant)**: Abstraksi perorangan atau organisasi sebagai pengaju izin

#### Modul 3 — Manajemen Perizinan
- Pengajuan izin baru (SENPI, POLSUS, HANDAK, SPORT)
- Alur status: Draft → Pending → Approved/Rejected
- Expired otomatis berdasarkan tanggal berlaku
- Upload dan manajemen dokumen pendukung
- Tipe rekomendasi: P1 (180 hari), P2 (365 hari), P3 (90 hari), IJIN_GUDANG (730 hari)
- Nomor izin otomatis saat disetujui
- Validasi kelengkapan berkas pemohon sebelum pengajuan

#### Modul 4 — Perpanjangan Izin
- Pengajuan perpanjangan izin yang kadaluarsa (max 60 hari sebelum/sesudah expired)
- Alur status: Draft → Pending → Approved/Rejected
- Maksimum perpanjangan 1 tahun
- Nomor renewal otomatis

#### Modul 5 — Manajemen Senjata
- Inventaris senjata (data, kondisi, status, lokasi gudang)
- Pengeluaran dan pengembalian senjata ke/dari izin
- Riwayat pergerakan senjata (weapon movement log)
- Transfer senjata antar gudang (perlu approval)
- Transfer kepemilikan via hibah (perlu approval)
- Riwayat kepemilikan senjata (ownership history)

#### Modul 6 — Kartu Pengpin (Kartu Penguasaan Pinjam Pakai Senjata Api Nonorganik)
- Khusus izin POLSUS (senjata api nonorganik milik TNI/Polri yang dipinjampakaikan)
- Penerbitan kartu per kombinasi izin + person + senjata
- Status: Active, Expired, Revoked, Suspended
- Cetak kartu fisik
- Pencabutan (revoke) dengan alasan
- Notifikasi kadaluarsa otomatis (30 hari sebelum)

#### Modul 7 — Notifikasi
- Notifikasi kadaluarsa Kartu Pengpin (email + database)
- Notifikasi kadaluarsa izin (tracking via notification_count)
- Notifikasi perubahan status approval (perizinan, renewal, transfer) — *infrastruktur tersedia, implementasi notifikasi pengiriman belum selesai*

#### Modul 8 — Audit Trail
- Log aktivitas semua perubahan pada Permit, Weapon, KartuPengpin
- Tracking pelaku dan waktu setiap perubahan

### 4.2 Out of Scope (Belum Direncanakan)
- Integrasi langsung dengan sistem NTPDN / Dukcapil untuk verifikasi NIK
- Portal pemohon eksternal (sistem ini untuk internal Intelkam)
- Laporan statistik dan dashboard analytics (ada infrastruktur Recharts tapi belum ada halaman)
- Mobile application (hanya web responsive)

---

## 5. User Stories Utama

### Manajemen Perizinan
- Sebagai **Staff**, saya ingin membuat draft izin baru dan melampirkan dokumen pendukung, agar pengajuan terdokumentasi sejak awal.
- Sebagai **Staff**, saya ingin mengajukan (submit) izin draft ke supervisor, agar proses approval bisa dimulai.
- Sebagai **Supervisor**, saya ingin menyetujui atau menolak pengajuan izin, agar keputusan tercatat dalam sistem.
- Sebagai **Staff**, saya ingin melihat daftar izin yang akan kadaluarsa dalam 30 hari ke depan.
- Sebagai **Staff**, saya ingin mengajukan perpanjangan izin yang sudah atau akan kadaluarsa.

### Manajemen Senjata
- Sebagai **Staff**, saya ingin menambahkan senjata baru ke inventaris dengan data lengkap.
- Sebagai **Staff**, saya ingin mengeluarkan senjata dari gudang ke suatu izin dan mencatat kondisi senjata saat keluar.
- Sebagai **Staff**, saya ingin mengajukan transfer senjata dari satu gudang ke gudang lain.
- Sebagai **Supervisor**, saya ingin menyetujui atau menolak permintaan transfer senjata.

### Kartu Pengpin
- Sebagai **Staff POLSUS**, saya ingin menerbitkan Kartu Pengpin untuk petugas yang diberi izin menggunakan senjata nonorganik.
- Sebagai **Staff**, saya ingin mencetak Kartu Pengpin untuk diberikan ke pemegang izin.
- Sebagai **Supervisor**, saya ingin mencabut Kartu Pengpin yang bermasalah dengan menyertakan alasan.
- Sebagai sistem, saya ingin mengirim notifikasi email 30 hari sebelum Kartu Pengpin kadaluarsa.

---

## 6. Persyaratan Non-Fungsional

| Kategori | Persyaratan |
|---|---|
| **Performa** | Halaman index utama load < 2 detik untuk 1000 records dengan pagination |
| **Keamanan** | HTTPS wajib, 2FA tersedia, dokumen disimpan di disk private (tidak bisa diakses langsung via URL) |
| **Ketersediaan** | Target uptime 99% pada jam kerja (08:00–17:00 WIB) |
| **Audit** | Semua perubahan data kritis harus terekam dengan actor dan timestamp |
| **Skalabilitas** | Sistem harus mampu menangani data izin selama minimal 5 tahun tanpa degradasi signifikan |
| **Kompatibilitas** | Mendukung Chrome, Firefox, Safari versi terbaru |

---

## 7. Batasan Teknis & Asumsi

- Database: PostgreSQL (tidak boleh diganti tanpa kajian migrasi)
- Queue: Redis wajib aktif untuk job processing
- File upload: Maksimum 2MB per dokumen, format PDF/JPG/PNG
- Deployment: Menggunakan Docker; dapat menggunakan Laravel Octane untuk production
- Email: Konfigurasi SMTP perlu disetel di production (saat ini masih `MAIL_MAILER=log`)

---

## 8. Status Progress Modul

| Modul | Status | Keterangan |
|---|---|---|
| Autentikasi & IAM | ✅ Selesai | Auth + 2FA + RBAC berfungsi |
| Master Data | ✅ Selesai | CRUD semua entity master data |
| Perizinan | ✅ Sebagian | CRUD + alur status sudah ada; notifikasi perubahan status belum aktif |
| Perpanjangan Izin | ⚠️ WIP | Logic ada, namun filter per divisi dan notifikasi belum aktif |
| Manajemen Senjata | ⚠️ WIP | CRUD + transfer + hibah ada; permission check di beberapa request masih `return true` |
| Kartu Pengpin | ✅ Sebagian | Penerbitan + cetak + revoke ada; scheduler belum terdaftar di console.php |
| Notifikasi | ⚠️ WIP | Infrastruktur ada; pengiriman notifikasi untuk permit/renewal/transfer belum selesai |
| Audit Trail | ✅ Selesai | Spatie Activitylog sudah terpasang pada model kunci |
| Test Results (Person) | ❌ Belum Ada | Model + migrasi ada; belum ada UI/route |
| Organization Representatives | ❌ Belum Ada | Model + migrasi ada; belum ada UI/route |
| Dashboard / Analytics | ❌ Belum Ada | Infrastruktur Recharts tersedia; halaman belum dibuat |

---

## 9. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Permission check weapon belum lengkap | User tanpa role bisa mengubah data senjata | Segera implementasikan `authorize()` di WeaponRequest |
| Scheduler Kartu Pengpin belum terdaftar | Kartu tidak auto-expire & notifikasi tidak terkirim | Daftarkan command di `console.php` |
| Inkonsistensi naming permission (dash vs underscore) | Policy authorization gagal silently | Standarisasi semua permission ke snake_case dan seed ulang |
| MAIL_MAILER=log di production | Notifikasi email tidak terkirim | Konfigurasi SMTP sebelum go-live |
| Permission Permit belum di-seed | PermitPolicy selalu menolak | Seed permission: view-permits, create-permits, edit-permits, delete-permits |

---

*Dokumen ini dihasilkan dari analisis kode per tanggal 15 April 2026.*
