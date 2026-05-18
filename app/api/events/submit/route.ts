import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSlug, generateEditToken, calculateTokenExpiry, deduplicateKategoriJarak } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await request.json();

    // Validasi required fields
    if (!formData.nama_event || !formData.nama_pengirim || !formData.email_pengirim || !formData.whatsapp_pengirim) {
      return NextResponse.json(
        { error: 'Field wajib tidak lengkap' },
        { status: 400 }
      );
    }

    // Validasi consent privasi
    if (!formData.consent_privasi) {
      return NextResponse.json(
        { error: 'Persetujuan privasi diperlukan' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = generateSlug(formData.nama_event, formData.tanggal_mulai);

    // Check duplikasi berdasarkan nama dan tanggal
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('nama_event', formData.nama_event)
      .eq('tanggal_mulai', formData.tanggal_mulai)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Event dengan nama dan tanggal yang sama sudah ada' },
        { status: 409 }
      );
    }

    // Generate edit token
    const editToken = generateEditToken();
    const tokenExpiry = calculateTokenExpiry(
      formData.tanggal_selesai || formData.tanggal_mulai
    );

    // Deduplikasi kategori jarak
    const kategoriJarak = deduplicateKategoriJarak(
      formData.kategori_jarak || [],
      formData.jarak_kustom
    );

    // Auto-set region cluster untuk Virtual Run
    let regionCluster = formData.region_cluster;
    const isVirtualOnly = formData.tipe_event?.length === 1 && formData.tipe_event.includes('Virtual Run');
    if (isVirtualOnly) {
      regionCluster = 'Virtual/Online';
    }

    // Insert event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        nama_event: formData.nama_event,
        slug,
        poster_url: formData.poster_url, // TODO: Handle file upload
        deskripsi: formData.deskripsi,
        tipe_event: formData.tipe_event || [],
        status_penyelenggaraan: 'normal',
        is_verified: false,
        
        // Kontak
        nama_pengirim: formData.nama_pengirim,
        email_pengirim: formData.email_pengirim,
        whatsapp_pengirim: formData.whatsapp_pengirim,
        consent_privasi: formData.consent_privasi,
        
        // Lokasi (bypass jika Virtual Run)
        provinsi_id: isVirtualOnly ? null : formData.provinsi_id,
        kota_id: isVirtualOnly ? null : formData.kota_id,
        zona_waktu: isVirtualOnly ? 'WIB' : formData.zona_waktu,
        region_cluster: regionCluster,
        detail_alamat: isVirtualOnly ? null : formData.detail_alamat,
        google_maps_link: isVirtualOnly ? null : formData.google_maps_link,
        course_map_link: formData.course_map_link,
        
        // Waktu
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai,
        tanggal_deadline: formData.tanggal_deadline,
        is_tentative: formData.is_tentative || false,
        
        // Pendaftaran
        url_pendaftaran: formData.url_pendaftaran,
        url_referensi: formData.url_referensi,
        
        // Hadiah & Fasilitas
        hadiah_juara: formData.hadiah_juara,
        fasilitas_unik: formData.fasilitas_unik,
        promo_komunitas: formData.promo_komunitas,
        
        // RPC
        rpc_lokasi: formData.rpc_lokasi,
        rpc_tanggal_mulai: formData.rpc_tanggal_mulai,
        rpc_tanggal_selesai: formData.rpc_tanggal_selesai,
        rpc_detail: formData.rpc_detail,
        
        // Kategori
        kategori_jarak: kategoriJarak,
        jarak_kustom: formData.jarak_kustom,
        label_sertifikasi: formData.label_sertifikasi || [],
        
        // Status & Token
        status: 'pending',
        edit_token: editToken,
        edit_token_expires_at: tokenExpiry.toISOString(),
        jumlah_laporan_link_mati: 0,
      })
      .select()
      .single();

    if (eventError) {
      console.error('Error inserting event:', eventError);
      return NextResponse.json(
        { 
          error: 'Gagal menyimpan event', 
          details: eventError.message,
          code: eventError.code,
          hint: eventError.hint 
        },
        { status: 500 }
      );
    }

    // Insert event distances jika ada
    if (formData.distances && formData.distances.length > 0) {
      for (const distance of formData.distances) {
        const { data: distanceData, error: distanceError } = await supabase
          .from('event_distances')
          .insert({
            event_id: event.id,
            kategori_jarak: distance.kategori_jarak,
            tanggal_pelaksanaan: distance.tanggal_pelaksanaan,
            jam_start: distance.jam_start,
            cut_off_time: distance.cut_off_time,
            elevation_gain: distance.elevation_gain ? parseInt(distance.elevation_gain) : null,
            itra_points: distance.itra_points,
            fasilitas_standard: distance.fasilitas_standard || [],
            sort_order: 0,
          })
          .select()
          .single();

        if (distanceError) {
          console.error('Error inserting distance:', distanceError);
          continue;
        }

        // Insert pricing tiers
        if (distance.pricing && distance.pricing.length > 0) {
          const pricingData = distance.pricing.map((tier: any) => ({
            distance_id: distanceData.id,
            nama_tier: tier.nama_tier,
            harga: parseInt(tier.harga),
            tanggal_mulai: tier.tanggal_mulai,
            tanggal_selesai: tier.tanggal_selesai,
          }));

          await supabase.from('distance_pricing').insert(pricingData);
        }
      }
    }

    // TODO: Send email dengan edit link menggunakan Resend
    // const editLink = `${process.env.NEXT_PUBLIC_SITE_URL}/edit/${editToken}`;
    // await sendEditLinkEmail(formData.email_pengirim, editLink, event);

    return NextResponse.json({
      success: true,
      message: 'Event berhasil disubmit! Cek email Anda untuk link edit.',
      event_id: event.id,
      edit_token: editToken, // Untuk development, hapus di production
    });

  } catch (error) {
    console.error('Error in submit event:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
