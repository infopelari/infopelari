-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE TABLES
-- events (tabel utama)
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_event TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  poster_url TEXT,
  deskripsi TEXT,
  tipe_event TEXT[] DEFAULT '{}',
  status_penyelenggaraan TEXT DEFAULT 'normal',
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Kontak Pengirim
  nama_pengirim TEXT NOT NULL,
  email_pengirim TEXT NOT NULL,
  whatsapp_pengirim TEXT NOT NULL,
  consent_privasi BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Lokasi
  provinsi_id TEXT,
  kota_id TEXT,
  zona_waktu TEXT DEFAULT 'WIB',
  region_cluster TEXT,
  detail_alamat TEXT,
  google_maps_link TEXT,
  course_map_link TEXT,
  
  -- Waktu
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  tanggal_deadline DATE,
  is_tentative BOOLEAN DEFAULT FALSE,
  
  -- Pendaftaran
  url_pendaftaran TEXT,
  url_referensi TEXT,
  
  -- Hadiah & Fasilitas
  hadiah_juara TEXT,
  fasilitas_unik TEXT,
  promo_komunitas TEXT,
  
  -- RPC
  rpc_lokasi TEXT,
  rpc_tanggal_mulai DATE,
  rpc_tanggal_selesai DATE,
  rpc_detail TEXT,
  
  -- Kategori & Label
  kategori_jarak TEXT[] DEFAULT '{}',
  jarak_kustom TEXT,
  label_sertifikasi TEXT[] DEFAULT '{}',
  
  -- Slider / Featured
  is_featured BOOLEAN DEFAULT FALSE,
  featured_order INTEGER,
  featured_start_date DATE,
  featured_end_date DATE,
  
  -- Status & Token
  status TEXT DEFAULT 'pending',
  edit_token TEXT UNIQUE,
  edit_token_expires_at TIMESTAMPTZ,
  jumlah_laporan_link_mati INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- event_distances (sub-event / kategori jarak)
CREATE TABLE public.event_distances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  kategori_jarak TEXT NOT NULL,
  tanggal_pelaksanaan DATE,
  jam_start TIME,
  cut_off_time TEXT,
  elevation_gain INTEGER,
  itra_points TEXT,
  fasilitas_standard TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0
);

-- distance_pricing (tiered pricing per distance)
CREATE TABLE public.distance_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distance_id UUID REFERENCES public.event_distances(id) ON DELETE CASCADE,
  nama_tier TEXT NOT NULL,
  harga INTEGER NOT NULL,
  tanggal_mulai DATE,
  tanggal_selesai DATE
);

-- hero_slides (slider iklan hero)
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES (Row Level Security)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_distances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distance_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Publik bisa melihat event yang sudah di-publish
CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status = 'published');

-- Publik bisa submit event baru (akan masuk sebagai 'pending')
CREATE POLICY "Public can insert pending events"
  ON public.events FOR INSERT
  WITH CHECK (status = 'pending');

-- Publik bisa melihat detail jarak dan harga dari event yang di-publish
CREATE POLICY "Public can view related distances"
  ON public.event_distances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_distances.event_id
      AND events.status = 'published'
    )
  );

-- Publik bisa insert distances untuk event pending mereka
CREATE POLICY "Public can insert distances for pending events"
  ON public.event_distances FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_distances.event_id
      AND events.status = 'pending'
    )
  );

CREATE POLICY "Public can view related pricing"
  ON public.distance_pricing FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.event_distances
      JOIN public.events ON events.id = event_distances.event_id
      WHERE event_distances.id = distance_pricing.distance_id
      AND events.status = 'published'
    )
  );

-- Publik bisa insert pricing untuk distances dari event pending
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

-- Publik bisa melihat hero slides yang aktif
CREATE POLICY "Public can view active hero slides"
  ON public.hero_slides FOR SELECT
  USING (
    (start_date IS NULL OR start_date <= CURRENT_DATE) AND
    (end_date IS NULL OR end_date >= CURRENT_DATE)
  );
