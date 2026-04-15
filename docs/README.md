# Dokumentasi SENDAK — Sistem Intelkam Polda Jatim

Folder ini berisi dokumentasi teknis dan bisnis proyek SENDAK.

| Dokumen | Deskripsi |
|---|---|
| [PRD.md](PRD.md) | Product Requirements Document — latar belakang, tujuan, ruang lingkup, user stories, status modul, dan risiko |
| [FSD.md](FSD.md) | Functional Specification Document — skema database lengkap, alur bisnis, endpoints, business rules, RBAC, isu teknis, dan backlog |

---

## Ringkasan Status Proyek (per 15 April 2026)

| Area | Status |
|---|---|
| Auth + IAM + Master Data | ✅ Selesai |
| Manajemen Perizinan (CRUD + Upload) | ✅ Selesai |
| Kartu Pengpin (POLSUS) | ✅ Selesai |
| Transfer & Hibah Senjata | ✅ Selesai |
| Perpanjangan Izin | ⚠️ WIP — filter divisi & notifikasi belum aktif |
| Notifikasi (permit/renewal/transfer) | ⚠️ WIP — infrastruktur ada, pengiriman belum |
| Weapon Permission Check | ⚠️ WIP — masih `return true` |
| Scheduler Kartu Pengpin | ⚠️ WIP — command ada, belum terdaftar di console.php |
| Test Results UI | ❌ Belum ada |
| Organization Representatives UI | ❌ Belum ada |
| Dashboard Analytics | ❌ Belum ada |
| Permission Seed Permit | ❌ Belum di-seed |

## Issue Kritis (Harus Selesai Sebelum Go-Live)
1. **C01** — Permission check weapon di-bypass (`return true`) di WeaponRequest
2. **C02** — Permission Permit belum di-seed (view-permits, create-permits, edit-permits, delete-permits)
3. **C03** — Scheduler `kartu-pengpin:expire` dan `kartu-pengpin:notify-expiring` belum terdaftar di `console.php`
4. **C04** — `MAIL_MAILER=log` masih digunakan (belum dikonfigurasi SMTP untuk production)
