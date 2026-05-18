// Database Types untuk Supabase
export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          nama_event: string
          slug: string
          poster_url: string | null
          deskripsi: string | null
          tipe_event: string[]
          status_penyelenggaraan: 'normal' | 'diundur' | 'dibatalkan'
          is_verified: boolean
          
          // Kontak Pengirim
          nama_pengirim: string
          email_pengirim: string
          whatsapp_pengirim: string
          consent_privasi: boolean
          
          // Lokasi
          provinsi_id: string | null
          kota_id: string | null
          zona_waktu: 'WIB' | 'WITA' | 'WIT'
          region_cluster: string | null
          detail_alamat: string | null
          google_maps_link: string | null
          course_map_link: string | null
          
          // Waktu
          tanggal_mulai: string | null
          tanggal_selesai: string | null
          tanggal_deadline: string | null
          is_tentative: boolean
          
          // Pendaftaran
          url_pendaftaran: string | null
          url_referensi: string | null
          
          // Hadiah & Fasilitas
          hadiah_juara: string | null
          fasilitas_unik: string | null
          promo_komunitas: string | null
          
          // RPC
          rpc_lokasi: string | null
          rpc_tanggal_mulai: string | null
          rpc_tanggal_selesai: string | null
          rpc_detail: string | null
          
          // Kategori & Label
          kategori_jarak: string[]
          jarak_kustom: string | null
          label_sertifikasi: string[]
          
          // Slider / Featured
          is_featured: boolean
          featured_order: number | null
          featured_start_date: string | null
          featured_end_date: string | null
          
          // Status & Token
          status: 'pending' | 'published' | 'edit-pending'
          edit_token: string | null
          edit_token_expires_at: string | null
          jumlah_laporan_link_mati: number
          
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      event_distances: {
        Row: {
          id: string
          event_id: string
          kategori_jarak: string
          tanggal_pelaksanaan: string | null
          jam_start: string | null
          cut_off_time: string | null
          elevation_gain: number | null
          itra_points: string | null
          fasilitas_standard: string[]
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['event_distances']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['event_distances']['Insert']>
      }
      distance_pricing: {
        Row: {
          id: string
          distance_id: string
          nama_tier: string
          harga: number
          tanggal_mulai: string | null
          tanggal_selesai: string | null
        }
        Insert: Omit<Database['public']['Tables']['distance_pricing']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['distance_pricing']['Insert']>
      }
      hero_slides: {
        Row: {
          id: string
          image_url: string
          alt_text: string | null
          link_url: string | null
          sort_order: number
          start_date: string | null
          end_date: string | null
          is_default: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['hero_slides']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['hero_slides']['Insert']>
      }
    }
  }
}

// Helper Types
export type Event = Database['public']['Tables']['events']['Row']
export type EventDistance = Database['public']['Tables']['event_distances']['Row']
export type DistancePricing = Database['public']['Tables']['distance_pricing']['Row']
export type HeroSlide = Database['public']['Tables']['hero_slides']['Row']

export type EventWithDetails = Event & {
  event_distances: (EventDistance & {
    distance_pricing: DistancePricing[]
  })[]
}
