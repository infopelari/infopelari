# 📘 Dokumentasi Implementasi infopelari.id

## ✅ Yang Sudah Selesai

### 1. **Struktur Database & Types** ✅
- `types/database.ts` - TypeScript types lengkap untuk semua tabel Supabase
- `lib/constants.ts` - Data Provinsi, Kota, Kategori Jarak, Label Sertifikasi, dll
- `supabase/schema.sql` - Schema database lengkap dengan RLS policies

### 2. **Utility Functions** ✅
- `lib/utils.ts` - Helper functions:
  - `generateSlug()` - Generate URL-friendly slug
  - `generateEditToken()` - Generate secure token untuk edit mandiri
  - `truncateText()` - Truncate deskripsi untuk card preview
  - `formatRupiah()` - Format harga ke Rupiah
  - `formatTanggalIndo()` - Format tanggal ke bahasa Indonesia
  - `deduplicateKategoriJarak()` - Deduplikasi & mapping jarak kustom
  - `isValidUrl()` - Validasi URL
  - `isPastDeadline()` - Check deadline
  - `daysUntilEvent()` - Hitung hari sampai event

### 3. **Komponen Reusable** ✅
- `components/Navbar.tsx` - Navigation bar sticky dengan search bar
- `components/SearchableDropdown.tsx` - Dropdown dengan fitur pencarian internal (sesuai blueprint)

### 4. **Halaman Utama** ✅

#### Homepage (`app/page.tsx`)
- ✅ Fetch events real dari Supabase
- ✅ Display event cards dengan poster, tanggal, lokasi
- ✅ Badge verified, status darurat (Diundur/Dibatalkan)
- ✅ Truncate deskripsi 120 karakter
- ✅ Link ke detail event
- ✅ Hero section (masih static, perlu dikembangkan untuk slider dinamis)

#### Detail Event (`app/events/[slug]/page.tsx`)
- ✅ Fetch event lengkap dengan relasi distances & pricing
- ✅ Display poster full size
- ✅ Badge verified & status darurat
- ✅ Deskripsi lengkap
- ✅ Tabel jadwal & harga per kategori jarak
- ✅ Info RPC (Race Pack Collection)
- ✅ Hadiah juara & fasilitas tambahan
- ✅ Lokasi dengan link Google Maps
- ✅ Link peta rute (GPX/Strava)
- ✅ Sticky register button dengan logika:
  - Disabled jika dibatalkan
  - Disabled jika tentatif
  - Disabled jika past deadline
  - Active jika masih open
- ✅ Tombol lapor link bermasalah

#### Form Submit Event (`app/submit/page.tsx`)
- ✅ Multi-step form (5 steps)
- ✅ Step 1: Info Dasar (Nama, Deskripsi, Tipe, Upload Poster)
- ✅ Step 2: Lokasi & Waktu
  - Searchable dropdown Provinsi & Kota
  - Zona waktu (WIB/WITA/WIT)
  - Bypass lokasi untuk Virtual Run
  - Tanggal mulai, selesai, deadline
  - Checkbox tentatif
- ⚠️ Step 3-5: Perlu dilengkapi (sudah ada struktur state)
  - Step 3: Kategori Jarak & Harga Detail
  - Step 4: Info Tambahan (URL, Hadiah, RPC)
  - Step 5: Kontak & Konfirmasi

#### Admin Pages
- ✅ `app/admin/login/page.tsx` - Login page dengan Supabase Auth
- ✅ `app/admin/page.tsx` - Dashboard UI (sidebar, tabs, mock data)
- ⚠️ Perlu integrasi dengan API untuk fetch & approve events

### 5. **API Routes** ✅

#### Submit Event (`app/api/events/submit/route.ts`)
- ✅ POST endpoint untuk submit event baru
- ✅ Validasi required fields
- ✅ Generate slug & edit token
- ✅ Check duplikasi (nama + tanggal)
- ✅ Auto-set region cluster untuk Virtual Run
- ✅ Deduplikasi kategori jarak
- ✅ Insert event ke database
- ✅ Insert event_distances & distance_pricing
- ⚠️ TODO: Upload poster ke Supabase Storage
- ⚠️ TODO: Send email dengan Resend

#### Admin Events (`app/api/admin/events/route.ts`)
- ✅ GET - Fetch events by status (pending/published)
- ✅ PATCH - Approve/reject event
- ✅ PUT - Update event (edit dari admin)
- ✅ DELETE - Delete event
- ✅ Auth check menggunakan Supabase Admin Client
- ⚠️ TODO: Send email notification ke panitia

---

## 🔄 Yang Perlu Dilengkapi

### Priority 1: Core Features

#### 1. **Lengkapi Form Submit (Step 3-5)**
File: `app/submit/page.tsx`
- [ ] Step 3: Kategori Jarak & Harga Detail
  - Dynamic form untuk multiple distances
  - Tiered pricing per distance
  - Fasilitas standard per distance
- [ ] Step 4: Info Tambahan
  - URL pendaftaran & referensi
  - Hadiah juara (textarea)
  - Fasilitas unik
  - Promo komunitas
  - Info RPC lengkap
- [ ] Step 5: Kontak & Konfirmasi
  - Nama, email, WhatsApp panitia
  - Checkbox consent privasi
  - Summary sebelum submit

#### 2. **Integrasi Form Submit dengan API**
File: `app/submit/page.tsx`
- [ ] Connect form submit ke `/api/events/submit`
- [ ] Handle file upload poster
- [ ] Show loading state
- [ ] Show success/error message
- [ ] Redirect atau reset form setelah sukses

#### 3. **Upload Poster ke Supabase Storage**
File: `app/api/upload/route.ts` (buat baru)
- [ ] Buat API route untuk upload
- [ ] Kompresi gambar ke WebP menggunakan `browser-image-compression`
- [ ] Validasi ukuran max 2MB
- [ ] Upload ke Supabase Storage bucket
- [ ] Return public URL

#### 4. **Dashboard Admin Fungsional**
File: `app/admin/page.tsx`
- [ ] Fetch pending events dari API
- [ ] Display tabel dengan data real
- [ ] Tombol approve dengan modal konfirmasi
- [ ] Checkbox "Mark as Verified"
- [ ] Tombol reject dengan konfirmasi
- [ ] Tombol edit (modal atau redirect)
- [ ] Tab untuk Published events
- [ ] Tab untuk Slider Hero management

#### 5. **Sistem Email dengan Resend**
File: `lib/email.ts` (buat baru)
- [ ] Setup Resend API key di `.env.local`
- [ ] Template email konfirmasi submit
- [ ] Template email approval
- [ ] Template email rejection
- [ ] Kirim secure edit link ke panitia
- [ ] Integrate dengan API routes

### Priority 2: Advanced Features

#### 6. **Halaman Edit Mandiri Panitia**
File: `app/edit/[token]/page.tsx` (buat baru)
- [ ] Validasi token dari URL
- [ ] Check token expiry
- [ ] Fetch event data by token
- [ ] Form edit (sama seperti submit tapi pre-filled)
- [ ] Sistem penguncian Hari H (disable edit jika tanggal >= tanggal_mulai)
- [ ] Submit edit → status kembali ke 'pending'

#### 7. **Filter & Pencarian di Homepage**
File: `app/page.tsx`
- [ ] Filter by Provinsi (searchable dropdown)
- [ ] Filter by Kota (dependent on Provinsi)
- [ ] Filter by Bulan
- [ ] Filter by Kategori Jarak (checkbox)
- [ ] Filter by Tipe Event
- [ ] Sorting (Event Terdekat, Terbaru, dll)
- [ ] Search bar (nama event)
- [ ] Apply filters ke Supabase query

#### 8. **Hero Slider Dinamis**
File: `app/page.tsx` & `app/admin/page.tsx`
- [ ] Fetch active hero slides dari database
- [ ] Display slider dengan auto-play
- [ ] Fallback ke poster default jika kosong
- [ ] Admin: Upload poster slider
- [ ] Admin: Set sort order, start/end date
- [ ] Admin: Delete slider

#### 9. **Calendar View**
File: `app/events/calendar/page.tsx` (buat baru)
- [ ] Tampilan kalender bulanan
- [ ] Display events pada tanggal masing-masing
- [ ] Click event → redirect ke detail
- [ ] Navigation prev/next month

#### 10. **Sistem Pelaporan Link Mati**
File: `app/api/events/report/route.ts` (buat baru)
- [ ] POST endpoint untuk lapor link mati
- [ ] Increment `jumlah_laporan_link_mati`
- [ ] Alert di admin dashboard jika >= 3 laporan

### Priority 3: Polish & Optimization

#### 11. **SEO & Open Graph**
- [ ] Dynamic meta tags per event detail page
- [ ] OG image menggunakan poster event
- [ ] Sitemap generation
- [ ] robots.txt

#### 12. **Anti-Spam & Security**
- [ ] Honeypot field di form submit
- [ ] Rate limiting untuk submit event
- [ ] CAPTCHA (optional)
- [ ] Sanitize HTML input

#### 13. **Cron Jobs / Scheduled Tasks**
- [ ] Auto-hide events 30 hari setelah selesai
- [ ] Auto-delete expired edit tokens
- [ ] Auto-expire hero slider ads
- [ ] Update active pricing tiers

#### 14. **Mobile Responsive**
- [ ] Test semua halaman di mobile
- [ ] Mobile menu untuk Navbar
- [ ] Touch-friendly dropdowns
- [ ] Responsive tables

---

## 🚀 Cara Melanjutkan Development

### Setup Environment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_key (untuk email)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Run Database Migration**
   - Buka Supabase Dashboard
   - SQL Editor → Paste isi `supabase/schema.sql`
   - Run

4. **Create Admin User**
   - Buka Supabase Dashboard → Authentication
   - Create new user dengan email & password
   - User ini akan bisa login ke `/admin`

5. **Setup Supabase Storage**
   - Buka Supabase Dashboard → Storage
   - Create bucket bernama `event-posters`
   - Set public access
   - Create bucket `hero-slides` untuk slider

### Development Workflow

1. **Run Development Server**
   ```bash
   npm run dev
   ```
   Buka http://localhost:3000

2. **Test Form Submit**
   - Buka http://localhost:3000/submit
   - Isi form (step 1-2 sudah berfungsi)
   - Check console untuk errors

3. **Test Admin Dashboard**
   - Buka http://localhost:3000/admin/login
   - Login dengan admin user
   - Check pending events (masih mock data)

4. **Test Detail Event**
   - Submit event via form atau insert manual ke database
   - Approve event via admin (atau set status='published' manual)
   - Buka http://localhost:3000/events/[slug]

### Next Steps (Prioritas)

1. ✅ **Lengkapi Form Submit Step 3-5** (2-3 jam)
2. ✅ **Upload Poster Implementation** (1 jam)
3. ✅ **Email Integration dengan Resend** (1-2 jam)
4. ✅ **Dashboard Admin Fungsional** (2 jam)
5. ✅ **Filter & Search Homepage** (2-3 jam)

**Total Estimasi:** 8-11 jam untuk core features lengkap.

---

## 📝 Catatan Penting

### Keamanan
- ✅ RLS policies sudah ada di schema.sql
- ✅ Admin routes menggunakan `createAdminClient()`
- ⚠️ Perlu tambah rate limiting untuk submit event
- ⚠️ Perlu sanitize HTML input untuk deskripsi

### Performance
- ✅ Supabase query sudah optimal (select specific fields)
- ⚠️ Perlu add caching untuk homepage
- ⚠️ Perlu optimize image loading (Next.js Image component)

### UX
- ✅ Dark mode theme sesuai blueprint
- ✅ Neon green/yellow accents
- ✅ Searchable dropdowns
- ⚠️ Perlu add loading states
- ⚠️ Perlu add error boundaries

### Testing
- ⚠️ Belum ada unit tests
- ⚠️ Belum ada E2E tests
- ⚠️ Perlu manual testing semua flows

---

## 🐛 Known Issues

1. **Form Submit Step 3-5 belum lengkap** - Perlu dilanjutkan
2. **Upload poster belum terimplementasi** - Masih TODO
3. **Email belum terkirim** - Perlu setup Resend
4. **Admin dashboard masih mock data** - Perlu connect ke API
5. **Hero slider masih static** - Perlu fetch dari database
6. **Filter & search belum ada** - Perlu implementasi
7. **Mobile menu belum ada** - Navbar perlu responsive menu

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan melanjutkan development, silakan tanya!

**Status Keseluruhan:** ~60% Complete
**Estimasi Completion:** 8-11 jam lagi untuk core features
