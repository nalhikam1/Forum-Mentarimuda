# Rencana Implementasi: Resolusi Total Dependensi cPanel & Paket Siap Jalan

Rencana ini berfokus pada penyelesaian akar masalah kegagalan `npm install` (`ERESOLVE could not resolve` esbuild) di cPanel dengan mempertahankan framework React yang bersih, merapikan `package.json` dari dependensi yang saling bertolak belakang, serta menyediakan struktur file dan script siap pakai agar langsung dapat dijalankan di cPanel tanpa eror.

---

## Keputusan Pengguna & Konfirmasi Teknis

> [!IMPORTANT]
> Berdasarkan sesi tanya jawab klarifikasi:
> - **Pendekatan Framework**: Tetap menggunakan **React bersih** dengan dependensi yang telah diaudit bebas eror (tidak perlu migrasi ke framework asing yang merombak seluruh basis kode).
> - **Metode Deployment**: Format **Upload file ZIP siap jalan** langsung ke File Manager cPanel, di mana pengguna dapat menjalankan `npm install` dan server dengan sukses 100%.

---

## 1. Analisis Akar Masalah (Root Cause Analysis)

1. **Penyebab Eror ERESOLVE di cPanel**:
   - Di `package.json` versi sebelumnya, terdapat dependensi `"esbuild": "^0.25.0"` di bagian `devDependencies`.
   - Di saat yang sama, build tool modern Vite (`vite@8.3.4`) mewajibkan `esbuild@"^0.27.0 || ^0.28.0"`, dan utilitas TypeScript runner `tsx` membawa `esbuild@0.28.2`.
   - Node.js versi 24 pada cPanel menggunakan npm v11/v12 yang menerapkan validasi dependensi ketat secara default. Saat npm menemukan konflik versi esbuild yang dipaksa di level root (`0.25.x` vs `0.28.x`), npm menghentikan proses instalasi dengan kode `ERESOLVE`.

2. **Mengapa Pergantian Framework Bukan Solusi Tepat**:
   - Error tersebut bukan disebabkan oleh React atau Vite sebagai framework, melainkan murni deklarasi versi paket `esbuild` yang sudah usang di file `package.json`.
   - Dengan menghapus baris usang tersebut, Vite mengelola esbuild secara mandiri tanpa ada konflik sama sekali, menghemat waktu dan mempertahankan fitur forum interaktif 100%.

---

## 2. Rencana Perbaikan & Kompatibilitas cPanel

### A. Harmonisasi Dependensi `package.json`
- Menghapus `"esbuild": "^0.25.0"` dari `devDependencies`.
- Menghapus dependensi yang tidak esensial untuk produksi cPanel guna mempercepat proses instalasi di lingkungan shared hosting.
- Memastikan script utama di `package.json` ramah cPanel:
  - `"dev"`: Menjalankan server development lokal.
  - `"build"`: Mengompilasi aplikasi React ke direktori `dist/`.
  - `"start"`: Menjalankan server produksi `node app.js`.
  - `"postinstall"`: Membantu eksekusi build otomatis saat tombol *Run NPM Install* ditekan di cPanel.

### B. Proteksi Konfigurasi `.npmrc`
- Memastikan file `.npmrc` menyertakan:
  ```ini
  legacy-peer-deps=true
  auto-install-peers=true
  ```
  Ini menjamin bahwa runner npm di cPanel tidak akan pernah berhenti akibat konflik peer dependency eksternal.

### C. Server Produksi Ringan (`app.js`)
- Menyediakan server Express bawaan yang kompatibel dengan fitur **Setup Node.js App** (Passenger) di cPanel.
- Menyajikan aset statis dari `dist/` dan menangani fallback URL Single Page Application (SPA).
- Menampilkan pesan panduan ramah jika direktori `dist/` belum di-build, sehingga pengguna tidak bingung melihat halaman error kosong.

### D. Konfigurasi Apache `.htaccess` untuk cPanel
- Menempatkan konfigurasi URL Rewrite di `public/.htaccess` agar saat dibuild otomatis tersalin ke `dist/.htaccess`.
- Mencegah error 404 saat pengguna melakukan refresh pada halaman seperti `/admin`, `/profile`, atau `/category/*`.

---

## 3. Arsitektur Alur Deployment di cPanel

```
┌─────────────────────────────────────────────────────────────┐
│                    Upload ZIP ke cPanel                     │
│  (File Manager -> Ekstrak ke folder aplikasi forum)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               cPanel Setup Node.js App                      │
│  - Startup file: app.js                                     │
│  - Node version: 22.x atau 24.x                             │
│  - Jalankan: Run NPM Install                                │
│    (Bebas eror ERESOLVE berkat penghapusan esbuild konflik) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Proses Build & Run                       │
│  - npm run build (menghasilkan dist/ & .htaccess)            │
│  - Klik Restart App di cPanel                               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Aplikasi Forum Mentarimuda Aktif                │
│  - URL domain publik langsung menampilkan Forum             │
│  - Routing SPA aktif tanpa eror 404 Apache                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Status Verifikasi (Verification Results) - SEMUA SELESAI ✅

1. **Pembersihan File Legacy & Konflik**:
   - `vercel.json` telah **dihapus** sepenuhnya.
   - `bun.lock` telah **dihapus** sepenuhnya.
   - Konfigurasi `.cpanel.yml` dan `.htaccess` aktif untuk cPanel Apache & Git Version Control.

2. **Resolusi Total Dependensi `package.json`**:
   - Menambahkan deklarasi `"overrides": { "esbuild": "^0.28.2" }` untuk mengunci dan memaksakan resolusi esbuild yang harmonis dengan Node.js 24 dan Vite.
   - Memindahkan tool build ke `devDependencies` dan menyisakan dependency produksi yang ramping.
   - Hasil uji: `npm install` lolos dengan **0 vulnerabilities**, **0 ERESOLVE error**.

3. **Uji Kompilasi & Linting**:
   - `npm run lint` (`tsc --noEmit`): **Lolos 100% tanpa error TypeScript**.
   - `npm run build`: **Kompilasi sukses 100%** menghasilkan bundle `dist/` (HTML, JS, CSS, `.htaccess`).

4. **Uji Runtime Server Node.js**:
   - Server produksi `node app.js` aktif dan melayani file statis SPA dengan respons HTTP 200.

5. **Paket ZIP cPanel Siap Pakai**:
   - File arsip `mentarimuda-forum-cpanel.zip` telah diperbarui dengan file bersih siap ekstrak ke File Manager cPanel.
