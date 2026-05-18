# 🔧 FIX: Gagal Menyimpan Event - RLS Policy Missing

## 🎯 MASALAH
Error "Gagal menyimpan event" terjadi karena **Row Level Security (RLS) Policy** di Supabase tidak mengizinkan public untuk INSERT data ke tabel `events`.

Saat ini RLS hanya mengizinkan:
- ✅ SELECT event yang sudah `published`
- ❌ INSERT event baru (TIDAK ADA POLICY!)

## 🛠️ SOLUSI

### Langkah 1: Buka Supabase SQL Editor
1. Login ke https://supabase.com
2. Pilih project **infopelari**
3. Klik menu **SQL Editor** di sidebar kiri
4. Klik **New Query**

### Langkah 2: Jalankan SQL Berikut

Copy-paste SQL ini dan klik **RUN**:

```sql
-- 1. Policy untuk INSERT events (status = pending)
CREATE POLICY "Public can insert pending events"
  ON public.events FOR INSERT
  WITH CHECK (status = 'pending');

-- 2. Policy untuk INSERT event_distances
CREATE POLICY "Public can insert distances for pending events"
  ON public.event_distances FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_distances.event_id
      AND events.status = 'pending'
    )
  );

-- 3. Policy untuk INSERT distance_pricing
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

### Langkah 3: Verifikasi Policy Sudah Aktif

Jalankan query ini untuk cek policy:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('events', 'event_distances', 'distance_pricing')
ORDER BY tablename, policyname;
```

Harusnya muncul 6 policies:
- ✅ `events`: "Public can view published events" (SELECT)
- ✅ `events`: "Public can insert pending events" (INSERT) ← **BARU**
- ✅ `event_distances`: "Public can view related distances" (SELECT)
- ✅ `event_distances`: "Public can insert distances for pending events" (INSERT) ← **BARU**
- ✅ `distance_pricing`: "Public can view related pricing" (SELECT)
- ✅ `distance_pricing`: "Public can insert pricing for pending events" (INSERT) ← **BARU**

## 📝 PENJELASAN

### Apa itu RLS (Row Level Security)?
RLS adalah fitur keamanan Supabase yang mengontrol siapa bisa akses data apa.

### Kenapa Perlu Policy INSERT?
Tanpa policy INSERT, public tidak bisa menambah data baru ke database, meskipun API route sudah benar.

### Kenapa Aman?
Policy ini hanya mengizinkan INSERT dengan kondisi:
- Event baru harus berstatus `pending` (bukan langsung `published`)
- Admin tetap harus verifikasi manual sebelum publish
- Data kontak pengirim tersimpan untuk verifikasi

## 🚀 SETELAH FIX

1. **Push code ke GitHub** (sudah saya update error logging):
   ```bash
   git add .
   git commit -m "fix: improve error logging for event submission"
   git push
   ```

2. **Test form submit** di https://infopelari.vercel.app/submit

3. **Jika masih error**, cek browser console (F12) untuk melihat error detail yang sekarang sudah lebih informatif.

## 🔍 DEBUGGING TAMBAHAN

Jika setelah fix RLS masih error, jalankan query ini untuk cek data yang masuk:

```sql
-- Cek event pending terakhir
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
LIMIT 5;
```

## 📞 KONTAK SUPPORT

Jika masih ada masalah:
1. Screenshot error di browser console (F12 → Console tab)
2. Screenshot error di Supabase Logs (Dashboard → Logs → API)
3. Kirim ke developer untuk analisis lebih lanjut

---

**File ini dibuat:** 2026-05-18  
**Status:** Ready to execute
