# Project Kapuas Hulu 2060 — Rules (PENTING)

Repo: `https://github.com/citrapricylia-am/story-of-kapuas` (branch `main`, GitHub Pages live di `https://citrapricylia-am.github.io/story-of-kapuas/`).

## LOCKED DESIGN (JANGAN PERNAH DIUBAH LAGI)
Versi saat ini (commit `f9f13c3`) sudah DISETUJUI user. Berikut elemen yang WAJIB dipertahankan persis:

- **Navbar**: logo "Kapuas" (kiri), title "Bagian III : Galeri 90 Penyimpang Positif" (tengah), menu dropdown burger (kanan) — jangan diubah.
- **Footer deck navigation**: tombol panah prev (`‹`) dan next (`›`) di kiri/kanan bawah — jangan diubah.
- **Penomoran halaman ("01" pagenum)**: SUDAH DIHAPUS permanen — jangan pernah dikembalikan.
- Layout deck: stage 1440x1024, slide, block posisi absolut `--x/--y`, body `overflow:hidden`.
- Design tokens: `--cream:#B18D48; --accent:#C2410C; --ink:#061B0E; --paper:#F7F2E6; --white:#FFFFFF`; Playfair Display + Montserrat 300.

## KONTEKS SEJARAH (supaya tidak mengulang)
- Versi Figma 100% (`ace9272`) pernah dibuat → **DITOLAK user** ("jelekkk... tadi sudah bagus hanya tinggal fix konten").
- Refactor fluid responsif (`7328ba2`) pernah dibuat → **DITOLAK user** (tidak sesuai design Figma, konten di kiri atas).
- Keduanya di-rollback. User MAU versi deck lama yang sekarang. JANGAN usul refactor layout lagi.

## WORKFLOW
- Setiap revisi: edit → `git add` → commit pesan jelas → `git push origin main` → tunggu Pages rebuild → verifikasi curl (tunggu sampai konten live berubah, cek berkala tiap ~20 detik).
- Cache browser user ±10 menit (max-age=600); bila perlu, bump `bagian3.css?v=N` dan/atau minta user hard refresh (Ctrl+Shift+R / Cmd+Shift+R).
- Verifikasi render: Playwright core di `/tmp/opencode/node_modules/playwright-core` + Chrome `/opt/google/chrome/chrome` (model tidak bisa lihat gambar).
- Jangan commit tanpa diminta user. Jangan inspect repo/proyek lain tanpa izin.

## DESIGN SYSTEM SECTION (BAGIAN III)
Definisi layout section lengkap ada di `DESIGN-SYSTEM.md` — Tipe B, B-MIRROR, C, C-MIRROR, E.
User memanggil tipe berdasarkan NAMA saat menetapkan layout section bab baru (contoh: "BAB 9 pakai Tipe C"). Selalu baca `DESIGN-SYSTEM.md` sebelum membangun/merombak section baru.

## SUMBER KONTEN (izin user)
- Mockup Figma (SVG): `/home/ubuntu/workspace/Project Kapuas Hulu 2060/mockup/design figma bagian 3/` — `Desktop - N.svg`.
- Foto mentah: `/home/ubuntu/workspace/Project Kapuas Hulu 2060/mockup/asset gambar kapuas/` — salin ke `assets/images/bagian3/` (JPG/PNG, bukan ARW/NEF).
- Slide dalam `assets/images/bagian3/manifest.json` memetakan `sNN` → file gambar (mis. s03 = BAB 6 = penjaga-rangkau + edukasi-sampah).
- Struktur halaman: 1 halaman = 1 BAB (section deck deck lama sudah diganti layout section responsif per halaman). Nav prev/next antar halaman BAB.