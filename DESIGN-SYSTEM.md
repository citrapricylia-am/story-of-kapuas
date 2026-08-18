# DESIGN SYSTEM — Bagian III : Galeri 90 Penyimpang Positif

Referensi layout section untuk halaman-halaman Bagian III. User akan memanggil tipe berdasarkan NAMA saat menentukan layout section baru (contoh: "Section BAB 9 pakai Tipe C", "Section BAB 10 pakai Tipe B-MIRROR"). Jika 1 bab terdiri dari beberapa section berurutan (pembuka + lanjutan), user menyebutkan urutannya.

## Tokens global (sudah ditetapkan)
- `--cream: #B18D48` (gold/coklat — warna panel teks), `--accent: #C2410C` (oranye solid — tombol carousel), `--ink: #061B0E`, `--paper: #F7F2E6`, `--white`.
- Font: Playfair Display (serif, judul) + Montserrat 300/400/500/600 (body/label).
- Navbar overlay di semua section: logo "KAPUAS" pojok kiri-atas, label kapital "BAGIAN III : GALERI 90 PENYIMPANG POSITIF" + ikon menu hamburger kanan-atas, sejajar horizontal.
- Tombol carousel: bulat oranye solid (`--accent`), ‹ kiri-bawah / › kanan-bawah section.
- Caption foto: judul caption (bold) + "Kredit Foto: ..." (italic, lebih kecil), putih dengan text-shadow.
- Responsive mobile (umum): stack vertikal, padding diperkecil, font judul dikecilkan, scroll normal.

---

## TIPE B — Split Hero (panel gambar kanan, panel teks kiri)
Split 2 panel, penuh tinggi layar (100vh), tanpa gap antar panel.
- Panel KIRI: teks, background solid gold/coklat (`--cream`). Navbar overlay di atas panel ini.
- Panel KANAN: gambar full-bleed `object-fit: cover`.
- Caption foto overlay pojok KANAN BAWAH gambar, dengan gradient overlay gelap tipis di area bawah gambar.
- Tombol carousel ‹ › di pojok kanan/kiri bawah section (di atas gambar/panel sesuai sisi).
- Mobile: stack vertikal, urutan gambar-lalu-teks (atau sesuai instruksi per section).

## TIPE B-MIRROR — Split Hero versi kebalikan
Sama persis dengan Tipe B, TAPI posisi panel dibalik:
- Panel GAMBAR di SISI KIRI (bukan kanan); panel TEKS (solid gold) di SISI KANAN.
- Logo "KAPUAS" tetap kiri-atas, TAPI karena di atas gambar → tambahkan text-shadow/drop-shadow putih supaya terbaca di atas foto apapun.
- Caption foto (judul + "Kredit Foto: ...") overlay pojok KIRI BAWAH gambar, gradient gelap tipis di bawah gambar.
- Tombol carousel ‹ › di pojok KANAN BAWAH section, sekarang di atas panel teks → warna oranye solid (`--accent`) supaya kontras di atas gold.
- Mobile: sama seperti Tipe B.

## TIPE C — Stack Full-Width (Teks Atas, Gambar Bawah)
1 kolom penuh, vertikal 2 blok:

BLOK ATAS (teks, background solid gold):
- Navbar overlay di dalam blok ini (logo kiri-atas, label + menu kanan-atas).
- Jarak vertikal 60-100px di bawah navbar, lalu judul bab serif putih besar (bisa 1 baris hampir selebar container), rata kiri.
- 1-2 paragraf LEBAR PENUH container (tanpa max-width sempit), `text-align: justify`, line-height 1.6-1.7, jarak antar paragraf 24-32px.
- Tinggi blok fleksibel (TIDAK dipaksa 100vh), natural kira-kira 55-65% tinggi viewport.

BLOK BAWAH (gambar, full-bleed):
- 1 gambar full width mengisi sisa tinggi, `object-fit: cover`.
- Caption (judul bold + kredit italic) pojok KIRI BAWAH, putih + text-shadow.
- Tombol carousel ‹ › bulat oranye solid pojok KANAN BAWAH gambar.
- Gradient overlay gelap tipis di bagian bawah gambar saja.

MOBILE: stack natural, kecilkan padding + font judul, scroll normal.

## TIPE C-MIRROR — Stack Full-Width (Gambar Atas, Teks Bawah)
Kebalikan urutan Tipe C:

BLOK ATAS (gambar, full-bleed, TIDAK 100vh penuh — cukup ~55-60% tinggi viewport):
- Gambar full width `object-fit: cover`.
- Navbar overlay kiri-atas (logo) + kanan-atas (label + menu), text-shadow untuk kontras.
- Caption overlay pojok KANAN BAWAH gambar (judul + kredit, rata kanan, putih, text-shadow) — BEDA dari Tipe C (kiri bawah).
- Gradient overlay gelap tipis bagian bawah gambar.
- TIDAK ADA judul bab di blok ini (judul sudah di blok/section sebelumnya; ini blok lanjutan).

BLOK BAWAH (teks, background solid gold, full width):
- 1-2 paragraf lanjutan, full width `text-align: justify` (sama seperti Tipe C), TANPA judul bab.
- Padding vertikal lega 48-64px atas-bawah.
- TIDAK ADA tombol carousel di blok ini (sudah tampil di blok gambar/section sebelumnya — jangan duplikat).

## TIPE E — Full-Bleed Background dengan Teks Overlay
1 elemen visual utama: gambar background PENUH section (100vw × 100vh), tanpa panel solid terpisah.
- Navbar overlay standar di atas gambar (putih + text-shadow).
- Blok teks (judul opsional jika pembuka / langsung paragraf jika lanjutan) overlay di SISI KIRI gambar, rata kiri, max-width 480-520px.
- Kontras teks (default): gradient overlay gelap dari kiri `rgba(0,0,0,0.5)` memudar ke transparan ke kanan; alternatif: text-shadow tebal `0 2px 8px rgba(0,0,0,0.6)`. Pakai (a) gradient kecuali gambar sudah gelap alami.
- Caption foto pojok KANAN BAWAH (judul + kredit, rata kanan, putih, text-shadow).
- Tombol carousel ‹ › pojok KANAN BAWAH, di bawah caption.

---

## Aturan pemakaian
- User menyebut nama tipe per section, misal: "BAB 9 → Tipe C", "BAB 10 → Tipe B-MIRROR", atau urutan "Tipe C diikuti Tipe C-MIRROR" untuk bab bersection lanjutan.
- Pola tipe ini konsisten dipakai di seluruh halaman.
- Mobile selalu: stack + scroll normal + padding/font kecil.