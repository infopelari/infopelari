# 🚀 Langkah Selanjutnya - infopelari.id

## 📋 Ringkasan Status Saat Ini

Saya sudah menyelesaikan **60% dari keseluruhan fitur** sesuai blueprint. Berikut yang sudah selesai:

### ✅ Sudah Selesai:
1. **Database & Types** - Schema SQL, TypeScript types, constants lengkap
2. **Utility Functions** - Helper untuk slug, token, format tanggal, dll
3. **Komponen Reusable** - Navbar, SearchableDropdown (dengan fitur pencarian)
4. **Homepage** - Fetch & display events dari database dengan badge & status
5. **Detail Event** - Halaman lengkap dengan tabel harga, RPC, hadiah, lokasi
6. **Form Submit (40%)** - Step 1-2 sudah lengkap (Info Dasar & Lokasi/Waktu)
7. **API Routes** - Submit event, admin CRUD operations
8. **Admin Dashboard (30%)** - UI sudah ada, perlu integrasi dengan API

### ⚠️ Perlu Dilengkapi:
1. **Form Submit Step 3-5** (Kategori Jarak Detail, Info Tambahan, Kontak)
2. **Upload Poster** ke Supabase Storage
3. **Dashboard Admin** - Connect ke API untuk fetch & approve events
4. **Email System** - Kirim edit link & notifikasi dengan Resend
5. **Filter & Search** di homepage
6. **Edit Mandiri Panitia** dengan token

---

## 🎯 Prioritas Berikutnya (Urutan Penting)

### Priority 1: Form Submit Lengkap (3 jam)

**File:** `app/submit/page.tsx`

Form sudah ada Step 1-2, tinggal lengkapi Step 3-5:

**Step 3: Kategori Jarak & Harga Detail**
- Quick select kategori jarak (sudah ada state)
- Input jarak kustom
- Label sertifikasi
- Dynamic form untuk multiple distances:
  - Kategori jarak dropdown
  - Tanggal pelaksanaan, jam start, cut off
  - Elevation gain & ITRA points (untuk trail)
  - Fasilitas standard (checkbox)
  - Tiered pricing (Early Bird, Normal, dll)
  - Tombol tambah/hapus distance

**Step 4: Info Tambahan**
- URL pendaftaran (required)
- URL referensi
- Hadiah juara (textarea)
- Fasilitas unik
- Promo komunitas
- Info RPC (lokasi, tanggal, syarat)

**Step 5: Kontak & Konfirmasi**
- Nama pengirim (required)
- Email pengirim (required)
- WhatsApp pengirim (required)
- Checkbox consent privasi (required)
- Summary info sebelum submit

**Integrasi dengan API:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('/api/events/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        distances: distances, // Array of distance data
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Event berhasil disubmit! Cek email untuk link edit.');
      // Redirect atau reset form
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    alert('Terjadi kesalahan. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};
```

---

### Priority 2: Upload Poster (1 jam)

**File Baru:** `app/api/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import imageCompression from 'browser-image-compression';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File terlalu besar (max 2MB)' }, { status: 400 });
    }
    
    // Kompresi ke WebP (di client-side sebelum upload lebih baik)
    // Atau gunakan sharp di server-side
    
    const supabase = await createAdminClient();
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('event-posters')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('event-posters')
      .getPublicUrl(fileName);
    
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

**Update Form Submit:**
```typescript
// Di form submit, tambahkan handler upload
const handlePosterUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  if (data.url) {
    setFormData({...formData, poster_url: data.url});
  }
};
```

---

### Priority 3: Dashboard Admin Fungsional (2 jam)

**File:** `app/admin/page.tsx`

**Fetch Pending Events:**
```typescript
'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  
  useEffect(() => {
    fetchEvents();
  }, [activeTab]);
  
  const fetchEvents = async () => {
    setLoading(true);
    const response = await fetch(`/api/admin/events?status=${activeTab}`);
    const data = await response.json();
    setEvents(data.events || []);
    setLoading(false);
  };
  
  const handleApprove = async (eventId: string, isVerified: boolean) => {
    if (!confirm('Approve event ini?')) return;
    
    const response = await fetch('/api/admin/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        action: 'approve',
        is_verified: isVerified,
      }),
    });
    
    const data = await response.json();
    if (data.success) {
      alert('Event berhasil diapprove!');
      fetchEvents(); // Refresh list
    }
  };
  
  const handleReject = async (eventId: string) => {
    if (!confirm('Reject event ini?')) return;
    
    const response = await fetch('/api/admin/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        action: 'reject',
      }),
    });
    
    const data = await response.json();
    if (data.success) {
      alert('Event berhasil direject!');
      fetchEvents();
    }
  };
  
  // ... rest of component
}
```

---

### Priority 4: Email System (2 jam)

**Setup Resend:**
1. Daftar di https://resend.com (gratis 100 email/hari)
2. Dapatkan API key
3. Tambahkan ke `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

**File Baru:** `lib/email.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEditLinkEmail(
  to: string,
  eventName: string,
  editLink: string
) {
  try {
    await resend.emails.send({
      from: 'infopelari.id <noreply@infopelari.id>',
      to,
      subject: `Event Anda "${eventName}" Berhasil Disubmit`,
      html: `
        <h2>Terima kasih telah submit event!</h2>
        <p>Event <strong>${eventName}</strong> telah masuk ke antrean moderasi admin.</p>
        <p>Anda dapat mengedit event kapan saja menggunakan link berikut:</p>
        <a href="${editLink}" style="background: #39FF14; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          Edit Event Saya
        </a>
        <p><small>Link ini berlaku sampai 30 hari setelah event selesai.</small></p>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendApprovalEmail(
  to: string,
  eventName: string,
  eventUrl: string
) {
  try {
    await resend.emails.send({
      from: 'infopelari.id <noreply@infopelari.id>',
      to,
      subject: `Event "${eventName}" Telah Disetujui!`,
      html: `
        <h2>Selamat! Event Anda telah disetujui 🎉</h2>
        <p>Event <strong>${eventName}</strong> sekarang sudah tayang di website.</p>
        <a href="${eventUrl}">Lihat Event</a>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
```

**Integrate di API:**
```typescript
// Di app/api/events/submit/route.ts
import { sendEditLinkEmail } from '@/lib/email';

// Setelah insert event berhasil:
const editLink = `${process.env.NEXT_PUBLIC_SITE_URL}/edit/${editToken}`;
await sendEditLinkEmail(
  formData.email_pengirim,
  formData.nama_event,
  editLink
);
```

---

### Priority 5: Filter & Search Homepage (2-3 jam)

**File:** `app/page.tsx`

Tambahkan state untuk filters:
```typescript
const [filters, setFilters] = useState({
  provinsi: '',
  kota: '',
  bulan: '',
  kategori: [],
  tipe: [],
  search: '',
});
```

Tambahkan UI filter di atas event grid:
```typescript
<div className="mb-8 bg-bgSecondary border border-borderLight rounded-xl p-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <SearchableDropdown
      label="Provinsi"
      options={PROVINSI_INDONESIA}
      value={filters.provinsi}
      onChange={(value) => setFilters({...filters, provinsi: value, kota: ''})}
    />
    
    <SearchableDropdown
      label="Kota"
      options={filters.provinsi ? KOTA_BY_PROVINSI[filters.provinsi] : []}
      value={filters.kota}
      onChange={(value) => setFilters({...filters, kota: value})}
      disabled={!filters.provinsi}
    />
    
    <input
      type="text"
      placeholder="Cari nama event..."
      value={filters.search}
      onChange={(e) => setFilters({...filters, search: e.target.value})}
      className="bg-bgTertiary border border-borderLight rounded p-3"
    />
  </div>
</div>
```

Update Supabase query dengan filters:
```typescript
let query = supabase
  .from('events')
  .select('*')
  .eq('status', 'published');

if (filters.provinsi) {
  query = query.eq('provinsi_id', filters.provinsi);
}

if (filters.kota) {
  query = query.eq('kota_id', filters.kota);
}

if (filters.search) {
  query = query.ilike('nama_event', `%${filters.search}%`);
}

const { data: events } = await query
  .order('tanggal_mulai', { ascending: true })
  .limit(12);
```

---

## 🛠️ Setup Awal (Jika Belum)

### 1. Supabase Storage
```sql
-- Di Supabase Dashboard → Storage
-- Create bucket: event-posters (public)
-- Create bucket: hero-slides (public)
```

### 2. Admin User
```sql
-- Di Supabase Dashboard → Authentication → Users
-- Add user manually dengan email & password
-- User ini bisa login ke /admin
```

### 3. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
RESEND_API_KEY=re_xxx...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📚 File-File Penting

### Sudah Ada & Siap Pakai:
- ✅ `types/database.ts` - TypeScript types
- ✅ `lib/constants.ts` - Data Provinsi, Kota, dll
- ✅ `lib/utils.ts` - Helper functions
- ✅ `lib/supabase/client.ts` & `server.ts` - Supabase clients
- ✅ `components/Navbar.tsx` - Navigation
- ✅ `components/SearchableDropdown.tsx` - Dropdown dengan search
- ✅ `app/page.tsx` - Homepage (fetch events)
- ✅ `app/events/[slug]/page.tsx` - Detail event lengkap
- ✅ `app/submit/page.tsx` - Form submit (40% done)
- ✅ `app/admin/page.tsx` - Dashboard admin (UI only)
- ✅ `app/admin/login/page.tsx` - Login page
- ✅ `app/api/events/submit/route.ts` - Submit event API
- ✅ `app/api/admin/events/route.ts` - Admin CRUD API

### Perlu Dibuat:
- ❌ `app/api/upload/route.ts` - Upload poster
- ❌ `lib/email.ts` - Email functions
- ❌ `app/edit/[token]/page.tsx` - Edit mandiri panitia
- ❌ `app/api/events/report/route.ts` - Lapor link mati

---

## 🎯 Target Completion

**Estimasi waktu untuk fitur core lengkap:** 8-10 jam

### Breakdown:
- Form Submit lengkap: 3 jam
- Upload Poster: 1 jam
- Dashboard Admin: 2 jam
- Email System: 2 jam
- Filter & Search: 2-3 jam

**Setelah itu, aplikasi sudah bisa digunakan end-to-end!**

---

## 💡 Tips Development

1. **Test Incremental** - Test setiap fitur setelah selesai
2. **Console Log** - Gunakan console.log untuk debug
3. **Supabase Dashboard** - Monitor database real-time
4. **Network Tab** - Check API requests di browser DevTools
5. **Error Handling** - Tambahkan try-catch di semua async functions

---

## 📞 Jika Ada Masalah

Jika menemui error atau butuh bantuan:
1. Check console browser untuk error messages
2. Check terminal untuk server errors
3. Check Supabase logs di dashboard
4. Tanya saya dengan menyertakan error message lengkap

**Semangat melanjutkan development! 🚀**
