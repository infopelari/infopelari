import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import { PROVINSI_INDONESIA, KOTA_BY_PROVINSI } from '@/lib/constants';
import type { EventWithDetails } from '@/types/database';

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  // Fetch event dengan relasi distances dan pricing
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      event_distances (
        *,
        distance_pricing (*)
      )
    `)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (error || !event) {
    notFound();
  }

  const eventData = event as EventWithDetails;

  // Helper functions
  const getProvinsiNama = (id: string) => PROVINSI_INDONESIA.find(p => p.id === id)?.nama || id;
  const getKotaNama = (provinsiId: string, kotaId: string) => {
    const kota = KOTA_BY_PROVINSI[provinsiId]?.find(k => k.id === kotaId);
    return kota?.nama || kotaId;
  };

  const formatTanggal = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const isRegistrationOpen = () => {
    if (eventData.status_penyelenggaraan === 'dibatalkan') return false;
    if (eventData.is_tentative) return false;
    if (!eventData.tanggal_deadline) return true;
    return new Date() <= new Date(eventData.tanggal_deadline);
  };

  const getButtonState = () => {
    if (eventData.status_penyelenggaraan === 'dibatalkan') {
      return { text: 'EVENT DIBATALKAN', color: 'bg-statusDanger', disabled: true };
    }
    if (eventData.is_tentative) {
      return { text: 'TANGGAL BELUM DIUMUMKAN', color: 'bg-statusWarning', disabled: true };
    }
    if (!isRegistrationOpen()) {
      return { text: 'REGISTRATION CLOSED', color: 'bg-textMuted', disabled: true };
    }
    return { text: 'DAFTAR SEKARANG', color: 'bg-accentGreen hover:bg-accentYellow', disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="text-textSecondary hover:text-white flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>

          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white flex-1">
              {eventData.nama_event}
            </h1>
            {eventData.is_verified && (
              <div className="flex-shrink-0 bg-accentGreen/20 border border-accentGreen rounded-full px-3 py-1 flex items-center gap-1">
                <svg className="w-4 h-4 text-accentGreen" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold text-accentGreen">VERIFIED</span>
              </div>
            )}
          </div>

          {/* Status Badges */}
          {eventData.status_penyelenggaraan !== 'normal' && (
            <div className={`inline-block px-4 py-2 rounded-lg font-bold text-sm mb-4 ${
              eventData.status_penyelenggaraan === 'diundur' 
                ? 'bg-statusWarning/20 border border-statusWarning text-statusWarning' 
                : 'bg-statusDanger/20 border border-statusDanger text-statusDanger'
            }`}>
              ⚠️ EVENT {eventData.status_penyelenggaraan.toUpperCase()}
            </div>
          )}
        </div>

        {/* Poster */}
        {eventData.poster_url && (
          <div className="mb-8 rounded-xl overflow-hidden border border-borderLight">
            <img 
              src={eventData.poster_url} 
              alt={eventData.nama_event}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Quick Info Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {eventData.tipe_event.map((tipe) => (
            <span key={tipe} className="px-3 py-1 bg-bgSecondary border border-borderLight rounded-full text-xs text-textSecondary">
              {tipe}
            </span>
          ))}
          {eventData.kategori_jarak.map((jarak) => (
            <span key={jarak} className="px-3 py-1 bg-accentGreen/20 border border-accentGreen rounded-full text-xs text-accentGreen font-medium">
              {jarak}
            </span>
          ))}
          {eventData.label_sertifikasi.map((label) => (
            <span key={label} className="px-3 py-1 bg-statusInfo/20 border border-statusInfo rounded-full text-xs text-statusInfo">
              {label}
            </span>
          ))}
        </div>

        {/* Deskripsi */}
        {eventData.deskripsi && (
          <div className="bg-bgSecondary border border-borderLight rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">📄 Deskripsi & Syarat Ketentuan</h2>
            <div className="text-textSecondary whitespace-pre-wrap leading-relaxed">
              {eventData.deskripsi}
            </div>
          </div>
        )}

        {/* Tabel Jadwal & Harga */}
        {eventData.event_distances && eventData.event_distances.length > 0 && (
          <div className="bg-bgSecondary border border-borderLight rounded-xl p-6 mb-8 overflow-x-auto">
            <h2 className="text-xl font-bold text-white mb-4">🏃 Jadwal & Harga</h2>
            <table className="w-full text-sm">
              <thead className="border-b border-borderLight">
                <tr className="text-left">
                  <th className="pb-3 pr-4 text-textSecondary font-medium">Kategori</th>
                  <th className="pb-3 pr-4 text-textSecondary font-medium">Tanggal & Waktu</th>
                  <th className="pb-3 pr-4 text-textSecondary font-medium">Harga</th>
                  <th className="pb-3 text-textSecondary font-medium">Fasilitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight">
                {eventData.event_distances.map((distance) => {
                  const activePricing = distance.distance_pricing.find(p => {
                    const now = new Date();
                    const start = p.tanggal_mulai ? new Date(p.tanggal_mulai) : null;
                    const end = p.tanggal_selesai ? new Date(p.tanggal_selesai) : null;
                    return (!start || now >= start) && (!end || now <= end);
                  });

                  return (
                    <tr key={distance.id} className="hover:bg-bgTertiary/50">
                      <td className="py-4 pr-4">
                        <div className="font-bold text-white">{distance.kategori_jarak}</div>
                        {distance.elevation_gain && (
                          <div className="text-xs text-textMuted">EG: {distance.elevation_gain}m</div>
                        )}
                        {distance.itra_points && (
                          <div className="text-xs text-statusInfo">ITRA: {distance.itra_points}</div>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-white">{formatTanggal(distance.tanggal_pelaksanaan)}</div>
                        {distance.jam_start && (
                          <div className="text-xs text-textMuted">
                            Start: {distance.jam_start} {eventData.zona_waktu}
                          </div>
                        )}
                        {distance.cut_off_time && (
                          <div className="text-xs text-textMuted">Cut Off: {distance.cut_off_time}</div>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        {activePricing ? (
                          <>
                            <div className="font-bold text-accentGreen">
                              Rp {activePricing.harga.toLocaleString('id-ID')}
                            </div>
                            <div className="text-xs text-textMuted">{activePricing.nama_tier}</div>
                          </>
                        ) : (
                          <div className="text-textMuted text-xs">Lihat website</div>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {distance.fasilitas_standard.map((fas) => (
                            <span key={fas} className="text-xs bg-bgTertiary px-2 py-0.5 rounded text-textSecondary">
                              {fas}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Course Map Link */}
        {eventData.course_map_link && (
          <div className="mb-8">
            <a 
              href={eventData.course_map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bgSecondary border border-accentGreen rounded-lg text-accentGreen font-bold hover:bg-accentGreen/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Lihat Peta Rute Resmi
            </a>
          </div>
        )}

        {/* RPC Info */}
        {eventData.rpc_lokasi && (
          <div className="bg-bgTertiary border border-borderLight rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">📦 Info Race Pack Collection (RPC)</h2>
            <div className="space-y-3 text-textSecondary">
              <div>
                <span className="font-medium text-white">Lokasi:</span> {eventData.rpc_lokasi}
              </div>
              {eventData.rpc_tanggal_mulai && eventData.rpc_tanggal_selesai && (
                <div>
                  <span className="font-medium text-white">Tanggal:</span> {formatTanggal(eventData.rpc_tanggal_mulai)} - {formatTanggal(eventData.rpc_tanggal_selesai)}
                </div>
              )}
              {eventData.rpc_detail && (
                <div>
                  <span className="font-medium text-white">Syarat:</span> {eventData.rpc_detail}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hadiah & Fasilitas */}
        {(eventData.hadiah_juara || eventData.fasilitas_unik || eventData.promo_komunitas) && (
          <div className="bg-bgSecondary border border-borderLight rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">🎁 Hadiah & Fasilitas Tambahan</h2>
            <div className="space-y-4">
              {eventData.hadiah_juara && (
                <div>
                  <h3 className="font-bold text-accentGreen mb-2">🏆 Hadiah Juara</h3>
                  <p className="text-textSecondary whitespace-pre-wrap">{eventData.hadiah_juara}</p>
                </div>
              )}
              {eventData.fasilitas_unik && (
                <div>
                  <h3 className="font-bold text-accentGreen mb-2">✨ Fasilitas Unik</h3>
                  <p className="text-textSecondary">{eventData.fasilitas_unik}</p>
                </div>
              )}
              {eventData.promo_komunitas && (
                <div>
                  <h3 className="font-bold text-accentGreen mb-2">💰 Promo Komunitas</h3>
                  <p className="text-textSecondary">{eventData.promo_komunitas}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lokasi */}
        {eventData.provinsi_id && eventData.kota_id && (
          <div className="bg-bgSecondary border border-borderLight rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">📍 Lokasi</h2>
            <div className="space-y-2 text-textSecondary">
              <div>
                <span className="font-medium text-white">Kota:</span> {getKotaNama(eventData.provinsi_id, eventData.kota_id)}, {getProvinsiNama(eventData.provinsi_id)}
              </div>
              {eventData.detail_alamat && (
                <div>
                  <span className="font-medium text-white">Alamat:</span> {eventData.detail_alamat}
                </div>
              )}
              {eventData.google_maps_link && (
                <a 
                  href={eventData.google_maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accentGreen hover:text-accentYellow transition-colors mt-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Buka di Google Maps
                </a>
              )}
            </div>
          </div>
        )}

        {/* Report Link */}
        <div className="text-center mb-8">
          <button className="text-sm text-textMuted hover:text-statusDanger transition-colors">
            ⚠️ Laporkan Link Bermasalah / Pendaftaran Error
          </button>
        </div>
      </main>

      {/* Sticky Register Button */}
      <div className="sticky bottom-0 bg-bgPrimary/95 backdrop-blur-md border-t border-borderLight p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <div className="font-bold text-white">{eventData.nama_event}</div>
            <div className="text-sm text-textSecondary">
              {formatTanggal(eventData.tanggal_mulai)} • {eventData.zona_waktu}
            </div>
          </div>
          {buttonState.disabled ? (
            <button 
              disabled
              className={`flex-1 md:flex-initial px-8 py-3 rounded-full font-bold text-bgPrimary ${buttonState.color} opacity-70 cursor-not-allowed`}
            >
              {buttonState.text}
            </button>
          ) : (
            <a 
              href={eventData.url_pendaftaran || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 md:flex-initial px-8 py-3 rounded-full font-bold text-bgPrimary ${buttonState.color} transition-colors shadow-[0_0_20px_rgba(57,255,20,0.4)] text-center`}
            >
              {buttonState.text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
