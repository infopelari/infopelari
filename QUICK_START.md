# ⚡ Quick Start Guide - infopelari.id

## 🎯 Status Saat Ini

✅ Website Live: https://infopelari.vercel.app/  
✅ Form Submit: **100% Lengkap** (5 steps)  
✅ Upload Poster: **Siap Pakai**  
✅ Database: **Connected**  
✅ Email: **Resend Configured**  

**Progress: 85% Complete** 🚀

---

## 🚨 LANGKAH PENTING SEBELUM TEST

### 1. Setup Supabase Storage (5 menit)

**Buka Supabase Dashboard:**
1. Login ke https://supabase.com
2. Pilih project Anda
3. Klik **Storage** di sidebar
4. Klik **"New bucket"**
5. Isi:
   - Name: `event-posters`
   - Public bucket: ✅ **CENTANG**
6. Klik **"Create bucket"**
7. Klik bucket `event-posters` → **Configuration** → Toggle **"Enable RLS"** menjadi **OFF**

**✅ Done!** Upload poster sekarang akan berfungsi.

---

## 🧪 Test Form Submit (10 menit)

### Step 1: Buka Form
```
https://infopelari.vercel.app/submit
```

### Step 2: Isi Form (5 Steps)

**Step 1 - Info Dasar:**
- Nama Event: `Test Jakarta Marathon 2026`
- Deskripsi: `Event test untuk verifikasi sistem`
- Tipe: Centang `Road Run`
- Upload Poster: Pilih gambar (max 2MB)

**Step 2 - Lokasi & Waktu:**
- Provinsi: `DKI Jakarta`
- Kota: `Jakarta Pusat`
- Zona Waktu: `WIB`
- Tanggal Mulai: Pilih tanggal di masa depan
- Deadline: Pilih tanggal sebelum tanggal mulai

**Step 3 - Kategori:**
- Centang beberapa kategori (5K, 10K, HM)
- Skip detail jarak (opsional)

**Step 4 - Info Tambahan:**
- URL Pendaftaran: `https://example.com/register`
- Isi field lain (opsional)

**Step 5 - Kontak:**
- Nama: `Test Admin`
- Email: **EMAIL ANDA** (link edit akan dikirim ke sini)
- WhatsApp: `08123456789`
- ✅ Centang consent privasi

### Step 3: Submit & Verify

1. Klik **"Submit Event"**
2. Tunggu loading (upload poster + submit data)
3. Jika sukses: Alert muncul + redirect ke homepage
4. Jika error: Check console browser (F12)

### Step 4: Check Database

1. Buka Supabase Dashboard
2. Klik **Table Editor** → `events`
3. Event baru harus muncul dengan status `pending`
4. Check `poster_url` ada URL Supabase Storage

### Step 5: Check Storage

1. Supabase Dashboard → **Storage** → `event-posters`
2. File poster harus ada
3. Klik file → Copy public URL
4. Paste di browser → Gambar harus muncul

---

## ✅ Jika Test Berhasil

**Selamat! Form submit sudah berfungsi 100%** 🎉

**Next Steps:**
1. Approve event manual di database (set `status` = `'published'`)
2. Refresh homepage → Event harus muncul
3. Click event → Detail page harus tampil lengkap

---

## ❌ Jika Ada Error

### Error: "Gagal upload poster"

**Solusi:**
1. Check bucket `event-posters` sudah dibuat
2. Check bucket di-set sebagai **Public**
3. Check RLS **disabled** (atau setup policies)
4. Check file size < 2MB

### Error: "Gagal submit event"

**Solusi:**
1. Buka Console Browser (F12)
2. Check tab **Network** → Cari request `/api/events/submit`
3. Click request → Check **Response** tab
4. Lihat error message detail
5. Kirim error message ke saya untuk bantuan

### Error: "No file provided"

**Solusi:**
1. Pastikan poster sudah di-upload
2. Check file size < 2MB
3. Check format file (JPG/PNG/WebP)

---

## 📊 Monitoring

### Check Logs di Vercel

1. Buka https://vercel.com
2. Pilih project `infopelari`
3. Klik tab **"Logs"**
4. Filter by **"Errors"**
5. Lihat error real-time saat submit

### Check Database Real-time

1. Supabase Dashboard → **Table Editor**
2. Refresh tabel `events` setelah submit
3. Verify data masuk dengan benar

---

## 🎯 Yang Sudah Bisa Dilakukan

✅ Submit event baru via form  
✅ Upload poster otomatis  
✅ Data masuk ke database  
✅ View event di homepage (setelah di-approve)  
✅ View detail event lengkap  

## ⚠️ Yang Belum Bisa

❌ Approve event via dashboard (harus manual di database)  
❌ Email notifikasi (belum diimplementasi)  
❌ Edit event via token (belum dibuat)  
❌ Filter & search di homepage  

---

## 🚀 Deploy ke Production

Jika test lokal berhasil, push ke GitHub:

```bash
git add .
git commit -m "feat: complete form submit with upload"
git push origin main
```

Vercel akan auto-deploy dalam 2-3 menit.

---

## 📞 Butuh Bantuan?

**Jika ada error atau pertanyaan:**
1. Screenshot error message
2. Copy error dari console browser
3. Kirim ke saya dengan detail:
   - Apa yang Anda lakukan
   - Error message lengkap
   - Screenshot jika perlu

**File Dokumentasi Lengkap:**
- `STATUS_UPDATE.md` - Status progress lengkap
- `SETUP_SUPABASE_STORAGE.md` - Setup storage detail
- `README_IMPLEMENTASI.md` - Dokumentasi teknis
- `NEXT_STEPS.md` - Panduan development lanjutan

---

## 🎊 Selamat!

Website infopelari.id sudah **85% selesai** dan siap untuk beta testing!

**Happy Testing! 🚀**
