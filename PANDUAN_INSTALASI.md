# 📋 PANDUAN INSTALASI INFOPELARI.ID
## Untuk Non-Programmer — Ikuti Langkah Demi Langkah

---

## LANGKAH 1: Install Node.js (WAJIB PERTAMA)

1. Buka browser, pergi ke: **https://nodejs.org**
2. Klik tombol hijau besar **"LTS"** (bukan Current)
3. Download file `.msi` → double-click untuk install
4. Klik Next → Next → Install → Finish
5. **Restart komputer setelah install**

**Cek berhasil:** Buka PowerShell → ketik `node --version` → harus muncul angka versi (misalnya v20.x.x)

---

## LANGKAH 2: Install Git

1. Buka browser, pergi ke: **https://git-scm.com/download/win**
2. Download installer (64-bit)
3. Double-click, klik Next terus sampai Finish (biarkan semua pengaturan default)

**Cek berhasil:** Buka PowerShell → ketik `git --version` → harus muncul angka versi

---

## LANGKAH 3: Install VS Code (Editor Kode)

1. Buka browser, pergi ke: **https://code.visualstudio.com**
2. Download untuk Windows → install seperti biasa
3. Buka VS Code, klik File -> Open Folder -> pilih folder `website` (di `C:\Users\Administrator\Desktop\Aplikasi\infopelari.id\website`)

---

## LANGKAH 4: Jalankan Website di Komputer Anda (Lokal)

Setelah Node.js dan Git terinstall:
1. Buka PowerShell atau Terminal di dalam VS Code (Klik menu `Terminal` -> `New Terminal`)
2. Pastikan posisi Anda di folder `website`
3. Jalankan perintah ini untuk menginstall kebutuhan website:
   ```powershell
   npm install
   ```

   > [!IMPORTANT]
   > **MUNCUL ERROR "running scripts is disabled"?**
   > Jika Anda melihat pesan error berwarna merah yang bertuliskan:
   > *`npm.ps1 cannot be loaded because running scripts is disabled on this system...`*
   > Ini adalah fitur keamanan Windows yang membatasi pengeksekusian script.
   > 
   > **Cara Mengatasinya (Sangat Mudah):**
   > 1. Salin (Copy) perintah di bawah ini:
   >    ```powershell
   >    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   >    ```
   > 2. Tempel (Paste) ke terminal VS Code Anda, lalu tekan **Enter**.
   > 3. Setelah itu, jalankan kembali perintah **`npm install`**.
   > 
   > *Tips: Cara ini sangat aman karena hanya mengizinkan script berjalan di jendela terminal yang sedang aktif ini saja.*

4. Setelah selesai (mungkin memakan waktu beberapa menit), jalankan perintah ini untuk menyalakan website:
   ```powershell
   npm run dev
   ```
5. Buka browser Anda dan pergi ke: **http://localhost:3000** (Website Anda sudah menyala!)

---

## LANGKAH 5: Setup Database Supabase (Budget 0)

1. Login ke **https://supabase.com** menggunakan akun Anda.
2. Klik **New Project** (nama bebas, misal: `infopelari`).
3. Tunggu ~2 menit sampai project siap.
4. Pergi ke menu **Project Settings (Ikon Gear) → INTEGRATIONS → DATA API** (atau **API** di beberapa akun).
5. Di halaman tersebut, Anda mungkin melihat beberapa istilah/nama yang berbeda tergantung versi tampilan Supabase. Gunakan tabel pencocokan di bawah ini untuk menyalin data yang benar:

   | Nama/Label di Website Supabase | Istilah Lain / Deskripsi | Salin ke Kolom di File `.env.local` |
   | :--- | :--- | :--- |
   | **API URL** | *RESTful endpoint...* | `NEXT_PUBLIC_SUPABASE_URL` |
   | **`anon` (public)** | **Publishable key** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
   | **`service_role` (secret)** | **Secret keys** / **Secret key** (klik *Reveal*) | `SUPABASE_SERVICE_ROLE_KEY` |

   > [!TIP]
   > - **`anon` / Publishable key** adalah kunci publik yang aman dipasang di sisi browser.
   > - **`service_role` / Secret key** adalah kunci admin rahasia. Pastikan klik tombol **"Reveal"** (ikon mata) di sebelah kanan kunci `service_role` terlebih dahulu untuk menampilkan kode aslinya, lalu salin.

6. Pergi ke menu **SQL Editor** di menu kiri Supabase.
7. Buka file `website/supabase/schema.sql` di komputer Anda, copy semua teksnya, lalu *Paste* di SQL Editor Supabase, dan klik **Run**. (Ini akan otomatis membuat tabel database Anda).

---

## LANGKAH 6: Menghubungkan Website dengan Supabase

1. Di dalam VS Code, buka file `.env.local` yang ada di folder `website/`.
2. Ubah isinya dengan data dari Supabase yang Anda salin di Langkah 5 tadi:
   ```text
   NEXT_PUBLIC_SUPABASE_URL=paste_URL_di_sini
   NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_public_key_di_sini
   SUPABASE_SERVICE_ROLE_KEY=paste_service_role_secret_key_di_sini
   ```
3. Simpan file (`Ctrl + S`).
4. Matikan terminal yang sedang jalan dengan tekan `Ctrl + C`, lalu ketik `npm run dev` lagi agar website menggunakan data terbaru.
5. **Uji Koneksi Database Anda:** 
   Buka browser dan buka alamat: **http://localhost:3000/test-db**
   
   - **Koneksi Sukses:** Anda akan melihat layar indah berwarna hijau bertuliskan **"KONEKSI BERHASIL! 🎉"**. Artinya website dan database Anda sudah tersambung 100%!
   - **Koneksi Gagal:** Layar akan berwarna merah dan menampilkan pesan error spesifik untuk membantu Anda memperbaikinya.

---

## LANGKAH 7: Deploy ke Vercel agar Online (Budget 0)

1. Login ke **https://github.com** dan buat repository baru bernama `infopelari`.
2. Di Terminal VS Code Anda (matikan dulu server dengan `Ctrl+C`), ketik berurutan:
   ```powershell
   git init
   git add .
   git commit -m "Upload pertama infopelari"
   git branch -M main
   git remote add origin https://github.com/USERNAME_GITHUB_ANDA/infopelari.git
   git push -u origin main
   ```
3. Login ke **https://vercel.com** menggunakan akun GitHub Anda.
4. Klik **Add New... → Project**.
5. Temukan repository `infopelari` Anda, lalu klik **Import**.
6. Buka menu lungsur (dropdown) **Environment Variables**.
7. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` persis seperti di file `.env.local`.
8. Klik **Deploy**.

Tunggu sekitar 2-3 menit. Setelah selesai, Vercel akan memberikan link gratis (misalnya `infopelari.vercel.app`) yang sudah bisa diakses oleh siapa saja di internet!

---

## ❓ Butuh Bantuan?
Jika mengalami pesan error di PowerShell atau saat menginstall, jangan ragu untuk menyalin pesan error tersebut dan kirimkan ke saya. Saya akan memandu Anda untuk memperbaikinya!
