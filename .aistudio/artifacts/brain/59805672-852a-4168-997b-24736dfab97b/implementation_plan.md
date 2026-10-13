# Rencana Implementasi: Reset Seluruh Data Demo ke 0 & Validasi Bebas Eror 100%

Tujuan utama dari rencana ini adalah memastikan Forum Komunitas Mentarimuda bebas dari data pura-pura/demo, angka acak, serta eror kompilasi. Semua metrik (topik, komentar, suka, voting, analitik, dan reputasi) dimulai secara nyata dari angka **0**, riwayat browser lama dibersihkan otomatis, dan website siap digunakan secara penuh untuk satu tahun ke depan.

---

## 1. Analisis & Masalah yang Ditemukan

1. **Data Benih (Seed Data) Masih Berisi Postingan & Angka Tiruan:**
   - Di `src/services/storage.ts`, masih terdapat 5 postingan tiruan (`SEED_POSTS`), 6 komentar tiruan (`SEED_COMMENTS`), aktivitas tiruan (`SEED_ACTIVITIES`), serta notifikasi tiruan (`SEED_NOTIFICATIONS`).
   - Angka suka (likes), views, dan voting pada postingan tiruan tersebut menggunakan angka buatan (seperti 420 views, 35 likes, 98 suara polling).
   - Akun Admin Utama memiliki nilai karma awal bawaan 2850 dan riwayat postCount/answerCount buatan (bukan 0).
   - Saat membuat topik baru, `likes` di-default ke 1 dan `views` ke 1 alih-alih 0.

2. **Penyimpanan Browser Lama (LocalStorage):**
   - Browser pengguna yang telah membuka aplikasi sebelumnya masih menyimpan data demo versi lama (`mentarimuda_*_v5`).
   - Sesuai jawaban klarifikasi pengguna, cache browser lama harus otomatis direset ke 0 saat pertama kali website dimuat.

3. **Bug TypeScript / Eror Kompilasi di `AnalyticsPage.tsx`:**
   - Ditemukan variabel/handler tak terdefinisi: `handleTriggerSimulation`, `isSimulating`, `Zap` yang menyebabkan `tsc --noEmit` gagal dengan exit code 1.
   - Angka hardcoded persentase `+18% interaksi minggu ini` dan skala grafik yang memaksakan minimal tinggi 12%-16% meskipun data bernilai 0.

4. **Kesiapan Jangka Panjang (1 Tahun ke Depan):**
   - Struktur data bersih, fungsi interaksi real-time (tambah topik, voting polling, komentar, suka/like, reputasi/karma, ganti profil) berjalan dinamis langsung dari 0 dengan penyimpanan terstruktur.

---

## 2. Perubahan yang Diusulkan (Proposed Changes)

### A. Reset Data Penyimpanan & Bersihkan Data Demo ke 0 (`src/services/storage.ts`)
- **Kosongkan data benih:**
  - `SEED_POSTS = []`: 0 topik saat awal website dibuka.
  - `SEED_COMMENTS = []`: 0 komentar.
  - `SEED_ACTIVITIES = []`: 0 aktivitas riwayat.
  - `SEED_NOTIFICATIONS = []`: 0 notifikasi lama.
  - Reset atribut `ADMIN_USER`: `postCount = 0`, `answerCount = 0`, `solutionsCount = 0`, `karma = 0`.
  - Reset atribut `GUEST_USER`: `karma = 0`, `postCount = 0`, `answerCount = 0`.
  - `SEED_CATEGORIES`: Tetap mempertahankan 6 kategori resmi, dengan `threadCount = 0`.
- **Pembersihan Otomatis Data Lama Browser:**
  - Perbarui key penyimpanan ke versi bersih terbaru (`_v6_clean`) atau deteksi flag pembersihan otomatis `mentarimuda_fresh_zero_v6`.
  - Saat `storageService.init()` berjalan pertama kali di browser, jika kunci versi lama terdeteksi atau flag belum ada, bersihkan data demo lama dan setel ulang ke format bersih 0.
- **Logika Nilai Awal Pembuatan Topik (`createPost`):**
  - Pastikan topik baru yang dibuat mulai dengan `views: 0`, `likes: 0`, `likedByUserIds: []`, dan `commentCount: 0`.
- **Fungsi Reset Database di Panel Admin (`resetToDefaultData`):**
  - Reset database mengembalikan forum ke kondisi bersih (0 topik, 0 komentar, 0 suka) bukan ke postingan demo lama.

---

### B. Perbaikan Bug & Validasi Halaman Analitik (`src/pages/AnalyticsPage.tsx`)
- **Perbaiki TypeScript Bug:**
  - Hapus referensi ke variabel tak terdefinisi (`handleTriggerSimulation`, `isSimulating`, `Zap`).
  - Ganti tombol simulasi dengan tombol **"Perbarui Data Real-Time"** resmi yang memanggil `loadData()` secara riil dan menampilkan status pembaruan data terkini.
- **Tampilan Metrik Real-Time Nyata:**
  - Ubah persentase hardcoded `+18% interaksi minggu ini` menjadi label dinamis berdasarkan data aktivitas riil pengguna (misal: "Dihitung dari aktivitas riil forum").
  - Perbaiki skala visual grafik batang mingguan (*Weekly Activity*): jika nilai 0, bar grafik tetap di 0 (atau garis dasar tipis rapi) tanpa memaksakan persentase palsu (12%/16%).
  - Tampilkan pesan ramah jika belum ada data aktivitas (*Empty State*: "Belum ada aktivitas interaksi tercatat").

---

### C. Halaman Beranda & Daftar Topik (`src/pages/HomePage.tsx`)
- Pastikan komponen widget seperti *Polling Pilihan Hari Ini* hanya tampil jika terdapat postingan bertipe polling yang valid; jika belum ada topik polling (karena mulai dari 0), sembunyikan dengan anggun tanpa eror.
- Pastikan *Leaderboard Top Kontributor* menangani kondisi awal saat anggota memiliki 0 poin reputasi secara estetis.
- Periksa status kosong (*Empty State*) topik: pesan *"Belum ada topik diskusi. Jadilah yang pertama membuat topik!"* tampil bersih dan terhubung langsung ke tombol buat topik.

---

### D. Audit & Validasi Menyeluruh Seluruh File Codebase
- Melakukan pemeriksaan baris demi baris pada:
  - `src/components/AuthModal.tsx`
  - `src/components/EditProfileModal.tsx`
  - `src/components/Navbar.tsx`
  - `src/components/NotificationCenterModal.tsx`
  - `src/components/NotificationToast.tsx`
  - `src/components/PollWidget.tsx`
  - `src/components/PostCard.tsx`
  - `src/pages/AdminDashboardPage.tsx`
  - `src/pages/CategoryPage.tsx`
  - `src/pages/CreatePostPage.tsx`
  - `src/pages/PostDetailPage.tsx`
  - `src/pages/ProfilePage.tsx`
  - `src/types/forum.ts`
  - `src/App.tsx`
- Jalankan verifikasi linting (`lint_applet` / `tsc --noEmit`) dan kompilasi build (`compile_applet`) untuk menjamin 0 kesalahan kode (100% clean).

---

## 3. Rencana Verifikasi (Verification Plan)

### Verifikasi Otomatis
1. **Pemeriksaan Sintaks & Tipe Data TypeScript:**
   - Jalankan `lint_applet` (`tsc --noEmit`) untuk memastikan semua file bebas dari eror tipe data.
2. **Kompilasi Aplikasi:**
   - Jalankan `compile_applet` (`npm run build`) untuk memastikan proses bundling Vite berjalan sukses tanpa peringatan fatal.

### Verifikasi Fungsional & Pengalaman Pengguna (Manual Journey)
1. **Kondisi Awal (Zero-Data State):**
   - Buka Beranda: Topik 0, Kategori 0 topik, Leaderboard 0 poin.
   - Buka Analitik: Total topik = 0, Total komentar = 0, Suara polling = 0, Resolusi Q&A = 0%, grafik seimbang mulai dari 0.
   - Profil Admin & Tamu: Postingan = 0, Tanggapan = 0, Reputasi = 0.
2. **Siklus Interaksi Riil Dimulai dari 0:**
   - Buat 1 topik baru (misal kategori *Teknologi & Koding*): verifikasi jumlah topik bertambah menjadi 1, views awal = 0, suka = 0.
   - Tambah tanggapan komentar: verifikasi komentar bertambah menjadi 1 secara real-time.
   - Klik Suka (Like): angka suka langsung berubah dari 0 ke 1, poin reputasi bertambah secara otomatis.
   - Periksa Halaman Analitik: metrik langsung mencerminkan data aktual 1 topik dan 1 komentar secara langsung.
3. **Pembersihan Cache Browser:**
   - Pastikan browser yang membuka aplikasi otomatis membersihkan cache versi demo lama.
