# 🚨 LANGKAH PERBAIKAN: Error "Gagal Menyimpan Event"

## ✅ YANG SUDAH SAYA LAKUKAN

1. ✅ **Improve error logging** di API route
   - Sekarang error message lebih detail (menampilkan `details`, `code`, `hint`)
   - Memudahkan debugging jika masih ada masalah

2. ✅ **Update schema.sql** dengan RLS policies yang benar
   - Menambahkan policy untuk INSERT events
   - Menambahkan policy untuk INSERT event_distances
   - Menambahkan policy untuk INSERT distance_pricing

3. ✅ **Push ke GitHub** 
   - Vercel akan auto-deploy dalam 2-3 menit
   - Commit: `fix: add RLS policies for event submission and improve error logging`

## 🎯 YANG HARUS ANDA LAKUKAN SEKARANG

### STEP 1: Jalankan SQL di Supabase (WAJIB!)

**Masalah utama:** Database Supabase Anda belum punya RLS policy untuk INSERT.

**Solusi:**

1. Buka https://supabase.com
2. Login dan pilih project **infopelari**
3. Klik **SQL Editor** di sidebar
4. Klik **New Query**
5. Copy-paste SQL ini:

```sql
-- Policy untuk INSERT events (status = pending)
CREATE POLICY "Public can insert pending events"
  ON public.events FOR INSERT
  WITH CHECK (status = 'pending');

-- Policy untuk INSERT event_distances
CREATE POLICY "Public can insert distances for pending events"
  ON public.event_distances FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_distances.event_id
      AND events.status = 'pending'
    )
  );

-- Policy untuk INSERT distance_pricing
CREATE POLICY "Public can insert pricing for pending events"
  ON public.distance_pricing FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.event_distances
      JOIN public.events ON events.id = event_distances.event_id
      WHERE event_distances.id = distance_pricing.distance_id
      AND events.status = 'pending'
    )
  );
```

6. Klik **RUN** (atau tekan Ctrl+Enter)
7. Pastikan muncul pesan sukses

### STEP 2: Test Form Submit

1. Tunggu 2-3 menit sampai Vercel selesai deploy
2. Buka https://infopelari.vercel.app/submit
3. Isi form dan submit event
4. Harusnya berhasil! ✅

### STEP 3: Jika Masih Error

Jika masih muncul error:

1. **Buka Browser Console** (tekan F12)
2. Klik tab **Console**
3. Submit form lagi
4. Screenshot error yang muncul
5. Kirim screenshot ke saya

Error message sekarang akan lebih detail, contoh:
```json
{
  "error": "Gagal menyimpan event",
  "details": "new row violates row-level security policy",
  "code": "42501",
  "hint": "Check RLS policies"
}
```

## 📊 VERIFIKASI RLS POLICY SUDAH AKTIF

Jalankan query ini di Supabase SQL Editor:

```sql
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('events', 'event_distances', 'distance_pricing')
ORDER BY tablename, policyname;
```

**Expected output:**

| tablename | policyname | cmd |
|-----------|-----------|-----|
| events | Public can view published events | SELECT |
| events | Public can insert pending events | INSERT |
| event_distances | Public can view related distances | SELECT |
| event_distances | Public can insert distances for pending events | INSERT |
| distance_pricing | Public can view related pricing | SELECT |
| distance_pricing | Public can insert pricing for pending events | INSERT |

Jika ada yang kurang, berarti SQL belum dijalankan dengan benar.

## 🔍 CEK EVENT YANG MASUK

Setelah berhasil submit, cek apakah event masuk ke database:

```sql
SELECT 
  id,
  nama_event,
  status,
  nama_pengirim,
  email_pengirim,
  created_at
FROM public.events
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 10;
```

## 📝 CATATAN PENTING

### Kenapa Error Ini Terjadi?

Row Level Security (RLS) di Supabase adalah fitur keamanan yang mengontrol siapa bisa akses data apa. 

Saat setup awal, kita hanya bikin policy untuk **SELECT** (baca data), tapi lupa bikin policy untuk **INSERT** (tambah data baru).

Jadi meskipun code API sudah benar, database menolak INSERT karena tidak ada izin.

### Apakah Aman?

Ya! Policy yang saya buat sangat aman:
- ✅ Public hanya bisa INSERT event dengan status `pending`
- ✅ Event tidak langsung publish, harus diverifikasi admin dulu
- ✅ Data kontak pengirim tersimpan untuk verifikasi
- ✅ Admin tetap punya kontrol penuh

## 🎉 SETELAH BERHASIL

Setelah form submit berhasil:

1. Event akan masuk ke database dengan status `pending`
2. Admin bisa lihat di dashboard `/admin` (belum functional)
3. Email dengan link edit akan dikirim ke pengirim (belum implemented)
4. Admin verifikasi dan ubah status jadi `published`
5. Event muncul di homepage

## 📞 BUTUH BANTUAN?

Jika masih ada masalah setelah ikuti semua langkah:

1. Screenshot error di browser console
2. Screenshot hasil query verifikasi RLS policy
3. Screenshot Supabase Logs (Dashboard → Logs → API)
4. Kirim semua screenshot ke developer

---

**Dibuat:** 2026-05-18  
**Priority:** 🔴 HIGH - Harus dikerjakan sekarang!  
**Estimasi:** 5 menit
