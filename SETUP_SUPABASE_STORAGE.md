# 📦 Setup Supabase Storage untuk Upload Poster

## Langkah-Langkah Setup

### 1. Buka Supabase Dashboard
- Login ke https://supabase.com
- Pilih project Anda (infopelari)

### 2. Buat Storage Bucket
1. Klik menu **Storage** di sidebar kiri
2. Klik tombol **"New bucket"**
3. Isi form:
   - **Name:** `event-posters`
   - **Public bucket:** ✅ **CENTANG** (agar poster bisa diakses publik)
   - **File size limit:** 2MB (opsional)
   - **Allowed MIME types:** `image/*` (opsional)
4. Klik **"Create bucket"**

### 3. Setup Policies (RLS)
Setelah bucket dibuat, kita perlu set policies agar:
- **Semua orang bisa READ** (lihat poster)
- **Hanya authenticated users bisa UPLOAD** (untuk keamanan)

**Cara Setup:**
1. Klik bucket `event-posters`
2. Klik tab **"Policies"**
3. Klik **"New policy"**

**Policy 1: Public Read**
```sql
-- Allow public to read/download posters
CREATE POLICY "Public can view posters"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-posters');
```

**Policy 2: Authenticated Upload**
```sql
-- Allow anyone to upload (kita handle auth di API)
CREATE POLICY "Anyone can upload posters"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-posters');
```

**ATAU** jika ingin lebih simple, bisa disable RLS untuk bucket ini:
1. Klik bucket `event-posters`
2. Klik **"Configuration"**
3. Toggle **"Enable RLS"** menjadi OFF

### 4. Test Upload Manual
1. Klik bucket `event-posters`
2. Klik **"Upload file"**
3. Upload gambar test
4. Klik file yang diupload
5. Copy **Public URL** (contoh: `https://xxx.supabase.co/storage/v1/object/public/event-posters/test.jpg`)
6. Paste di browser, pastikan gambar bisa diakses

### 5. Verifikasi Environment Variables
Pastikan di `.env.local` sudah ada:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

## ✅ Checklist
- [ ] Bucket `event-posters` sudah dibuat
- [ ] Bucket di-set sebagai **Public**
- [ ] Policies sudah di-setup (atau RLS disabled)
- [ ] Test upload manual berhasil
- [ ] Public URL bisa diakses di browser
- [ ] Environment variables sudah benar

## 🚀 Setelah Setup Selesai
API route `/api/upload` akan otomatis berfungsi untuk upload poster dari form submit.

## 📝 Notes
- Ukuran max file: 2MB (divalidasi di frontend & backend)
- Format yang diterima: JPG, PNG, WebP
- File akan disimpan dengan nama: `timestamp-originalname.ext`
- Public URL akan otomatis di-generate oleh Supabase
