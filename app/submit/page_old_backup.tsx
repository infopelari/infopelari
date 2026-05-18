'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchableDropdown from '@/components/SearchableDropdown';
import { 
  PROVINSI_INDONESIA, 
  KOTA_BY_PROVINSI, 
  REGION_CLUSTERS,
  ZONA_WAKTU,
  TIPE_EVENT,
  KATEGORI_JARAK,
  LABEL_SERTIFIKASI,
  FASILITAS_STANDARD
} from '@/lib/constants';

interface DistanceData {
  kategori_jarak: string;
  tanggal_pelaksanaan: string;
  jam_start: string;
  cut_off_time: string;
  elevation_gain: string;
  itra_points: string;
  fasilitas_standard: string[];
  pricing: {
    nama_tier: string;
    harga: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
  }[];
}

export default function SubmitEventPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Identitas Event
    nama_event: '',
    poster_url: null as File | null,
    deskripsi: '',
    tipe_event: [] as string[],
    
    // Kontak Pengirim
    nama_pengirim: '',
    email_pengirim: '',
    whatsapp_pengirim: '',
    consent_privasi: false,
    
    // Lokasi
    provinsi_id: '',
    kota_id: '',
    zona_waktu: 'WIB' as 'WIB' | 'WITA' | 'WIT',
    region_cluster: '',
    detail_alamat: '',
    google_maps_link: '',
    course_map_link: '',
    
    // Waktu
    tanggal_mulai: '',
    tanggal_selesai: '',
    tanggal_deadline: '',
    is_tentative: false,
    
    // Pendaftaran
    url_pendaftaran: '',
    url_referensi: '',
    
    // Hadiah & Fasilitas
    hadiah_juara: '',
    fasilitas_unik: '',
    promo_komunitas: '',
    
    // RPC
    rpc_lokasi: '',
    rpc_tanggal_mulai: '',
    rpc_tanggal_selesai: '',
    rpc_detail: '',
    
    // Kategori & Label
    kategori_jarak: [] as string[],
    jarak_kustom: '',
    label_sertifikasi: [] as string[],
  });

  const [distances, setDistances] = useState<DistanceData[]>([]);

  const isVirtualOnly = formData.tipe_event.length === 1 && formData.tipe_event.includes('Virtual Run');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload poster first if exists
      let posterUrl = '';
      if (formData.poster_url) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.poster_url);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Gagal upload poster');
        }
        
        const uploadData = await uploadResponse.json();
        posterUrl = uploadData.url;
      }

      // Submit event data
      const response = await fetch('/api/events/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          poster_url: posterUrl,
          distances: distances,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal submit event');
      }

      // Success
      alert('✅ Event berhasil disubmit!\n\nEvent Anda masuk ke antrean moderasi Admin.\nLink edit akan dikirim ke email: ' + formData.email_pengirim);
      
      // Redirect to homepage
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('❌ Terjadi kesalahan: ' + (error.message || 'Silakan coba lagi.'));
    } finally {
      setLoading(false);
    }
  };

  const addDistance = () => {
    setDistances([...distances, {
      kategori_jarak: '',
      tanggal_pelaksanaan: formData.tanggal_mulai,
      jam_start: '',
      cut_off_time: '',
      elevation_gain: '',
      itra_points: '',
      fasilitas_standard: [],
      pricing: [{
        nama_tier: 'Normal',
        harga: '',
        tanggal_mulai: '',
        tanggal_selesai: formData.tanggal_deadline,
      }]
    }]);
  };

  const removeDistance = (index: number) => {
    setDistances(distances.filter((_, i) => i !== index));
  };

  const updateDistance = (index: number, field: keyof DistanceData, value: any) => {
    const updated = [...distances];
    updated[index] = { ...updated[index], [field]: value };
    setDistances(updated);
  };

  const addPricingTier = (distanceIndex: number) => {
    const updated = [...distances];
    updated[distanceIndex].pricing.push({
      nama_tier: '',
      harga: '',
      tanggal_mulai: '',
      tanggal_selesai: formData.tanggal_deadline,
    });
    setDistances(updated);
  };

  const removePricingTier = (distanceIndex: number, tierIndex: number) => {
    const updated = [...distances];
    updated[distanceIndex].pricing = updated[distanceIndex].pricing.filter((_, i) => i !== tierIndex);
    setDistances(updated);
  };

  const updatePricingTier = (distanceIndex: number, tierIndex: number, field: string, value: any) => {
    const updated = [...distances];
    updated[distanceIndex].pricing[tierIndex] = {
      ...updated[distanceIndex].pricing[tierIndex],
      [field]: value
    };
    setDistances(updated);
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Pasang Event Lari</h1>
          <p className="text-textSecondary">Isi formulir di bawah ini. Tim kami akan memverifikasi sebelum ditayangkan.</p>
        </div>

        {/* Form Container */}
        <div className="bg-bgSecondary border border-borderLight rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: Info Dasar Event */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-accentGreen mb-4">📋 Informasi Dasar Event</h2>
                
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Nama Event <span className="text-statusDanger">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={formData.nama_event}
                    onChange={(e) => setFormData({...formData, nama_event: e.target.value})}
                    placeholder="Contoh: Jakarta Marathon 2026" 
                    className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Deskripsi Event (Syarat & Ketentuan, Info Umum)</label>
                  <textarea 
                    rows={6}
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    placeholder="Jelaskan detail event, syarat & ketentuan, fasilitas, dll..."
                    className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Tipe Event (Bisa pilih lebih dari satu)</label>
                  <div className="flex flex-wrap gap-3">
                    {TIPE_EVENT.map((type) => (
                      <label key={type} className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer border transition-colors ${formData.tipe_event.includes(type) ? 'bg-accentGreen/20 border-accentGreen text-accentGreen' : 'bg-bgTertiary border-borderLight hover:border-accentGreen'}`}>
                        <input 
                          type="checkbox" 
                          checked={formData.tipe_event.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, tipe_event: [...formData.tipe_event, type]})
                            } else {
                              setFormData({...formData, tipe_event: formData.tipe_event.filter(t => t !== type)})
                            }
                          }}
                          className="accent-accentGreen w-4 h-4" 
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Upload Poster Event <span className="text-statusDanger">*</span></label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validasi ukuran max 2MB
                        if (file.size > 2 * 1024 * 1024) {
                          alert('Ukuran file terlalu besar! Maksimal 2MB.');
                          e.target.value = '';
                          return;
                        }
                        setFormData({...formData, poster_url: file});
                      }
                    }}
                    className="hidden"
                    id="poster-upload"
                  />
                  <label 
                    htmlFor="poster-upload"
                    className="border-2 border-dashed border-borderLight rounded-lg p-8 flex flex-col items-center justify-center hover:border-accentGreen cursor-pointer transition-colors bg-bgTertiary block"
                  >
                    <svg className="w-8 h-8 text-textMuted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-textSecondary text-center">
                      {formData.poster_url ? (
                        <span className="text-accentGreen">✓ File terpilih: {formData.poster_url.name}</span>
                      ) : (
                        <>Klik untuk upload atau drag & drop<br/>(Maks 2MB, JPG/PNG/WebP)</>
                      )}
                    </p>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: Lokasi & Waktu */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-accentGreen mb-4">📍 Lokasi & Waktu</h2>

                {!isVirtualOnly && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SearchableDropdown
                        label="Provinsi"
                        options={PROVINSI_INDONESIA}
                        value={formData.provinsi_id}
                        onChange={(value) => setFormData({...formData, provinsi_id: value, kota_id: ''})}
                        placeholder="Pilih Provinsi"
                        required
                      />

                      <SearchableDropdown
                        label="Kota/Kabupaten"
                        options={formData.provinsi_id ? (KOTA_BY_PROVINSI[formData.provinsi_id] || []) : []}
                        value={formData.kota_id}
                        onChange={(value) => setFormData({...formData, kota_id: value})}
                        placeholder="Pilih Kota"
                        required
                        disabled={!formData.provinsi_id}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-2">Zona Waktu <span className="text-statusDanger">*</span></label>
                        <select 
                          required
                          value={formData.zona_waktu}
                          onChange={(e) => setFormData({...formData, zona_waktu: e.target.value as any})}
                          className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                        >
                          {ZONA_WAKTU.map(zona => (
                            <option key={zona} value={zona}>{zona}</option>
                          ))}
                        </select>
                      </div>

                      <SearchableDropdown
                        label="Region Cluster"
                        options={REGION_CLUSTERS.map(r => ({ id: r, nama: r }))}
                        value={formData.region_cluster}
                        onChange={(value) => setFormData({...formData, region_cluster: value})}
                        placeholder="Pilih Region"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-2">Detail Alamat / Start Point</label>
                      <input 
                        type="text"
                        value={formData.detail_alamat}
                        onChange={(e) => setFormData({...formData, detail_alamat: e.target.value})}
                        placeholder="Contoh: Bundaran HI, Jl. MH Thamrin"
                        className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-2">Link Google Maps</label>
                        <input 
                          type="url"
                          value={formData.google_maps_link}
                          onChange={(e) => setFormData({...formData, google_maps_link: e.target.value})}
                          placeholder="https://maps.google.com/..."
                          className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-2">Link Peta Rute (GPX/Strava)</label>
                        <input 
                          type="url"
                          value={formData.course_map_link}
                          onChange={(e) => setFormData({...formData, course_map_link: e.target.value})}
                          placeholder="https://strava.com/..."
                          className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                        />
                      </div>
                    </div>
                  </>
                )}

                {isVirtualOnly && (
                  <div className="bg-statusInfo/20 border border-statusInfo rounded-lg p-4">
                    <p className="text-sm text-statusInfo">✓ Event Virtual Run terdeteksi. Pengisian lokasi fisik dilewati.</p>
                  </div>
                )}

                <div className="border-t border-borderLight pt-6 mt-6">
                  <h3 className="text-lg font-bold text-white mb-4">⏰ Waktu Pelaksanaan</h3>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={formData.is_tentative}
                        onChange={(e) => setFormData({...formData, is_tentative: e.target.checked})}
                        className="accent-accentGreen w-4 h-4"
                      />
                      <span className="text-sm text-textSecondary">Tanggal masih tentatif / belum pasti (TBC)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-2">Tanggal Mulai <span className="text-statusDanger">*</span></label>
                      <input 
                        type="date"
                        required
                        value={formData.tanggal_mulai}
                        onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                        className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-2">Tanggal Selesai (Opsional)</label>
                      <input 
                        type="date"
                        value={formData.tanggal_selesai}
                        onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                        className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                      />
                      <p className="text-xs text-textMuted mt-1">Untuk event multi-hari</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-2">Deadline Pendaftaran <span className="text-statusDanger">*</span></label>
                      <input 
                        type="date"
                        required
                        value={formData.tanggal_deadline}
                        onChange={(e) => setFormData({...formData, tanggal_deadline: e.target.value})}
                        className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Kategori Jarak & Harga Detail */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-accentGreen mb-4">🏃 Kategori Jarak & Harga</h2>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Kategori Jarak Tersedia (Quick Select)</label>
                  <div className="flex flex-wrap gap-3">
                    {KATEGORI_JARAK.map((jarak) => (
                      <label key={jarak} className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer border transition-colors ${formData.kategori_jarak.includes(jarak) ? 'bg-accentGreen/20 border-accentGreen text-accentGreen' : 'bg-bgTertiary border-borderLight hover:border-accentGreen'}`}>
                        <input 
                          type="checkbox"
                          checked={formData.kategori_jarak.includes(jarak)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, kategori_jarak: [...formData.kategori_jarak, jarak]})
                            } else {
                              setFormData({...formData, kategori_jarak: formData.kategori_jarak.filter(j => j !== jarak)})
                            }
                          }}
                          className="accent-accentGreen w-4 h-4" 
                        />
                        <span className="text-sm">{jarak}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Jarak Kustom (Opsional)</label>
                  <input 
                    type="text"
                    value={formData.jarak_kustom}
                    onChange={(e) => setFormData({...formData, jarak_kustom: e.target.value})}
                    placeholder="Contoh: 7K, 12K, 50 Miles"
                    className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                  />
                  <p className="text-xs text-textMuted mt-1">Untuk jarak yang tidak ada di daftar standar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Label Sertifikasi (Opsional)</label>
                  <div className="flex flex-wrap gap-2">
                    {LABEL_SERTIFIKASI.map((label) => (
                      <label key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer border text-xs transition-colors ${formData.label_sertifikasi.includes(label) ? 'bg-statusInfo/20 border-statusInfo text-statusInfo' : 'bg-bgTertiary border-borderLight hover:border-statusInfo'}`}>
                        <input 
                          type="checkbox"
                          checked={formData.label_sertifikasi.includes(label)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, label_sertifikasi: [...formData.label_sertifikasi, label]})
                            } else {
                              setFormData({...formData, label_sertifikasi: formData.label_sertifikasi.filter(l => l !== label)})
                            }
                          }}
                          className="accent-statusInfo w-3 h-3" 
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-bgTertiary/50 border border-borderLight rounded-lg p-4">
                  <p className="text-sm text-textSecondary">
                    💡 <strong>Opsional:</strong> Anda bisa skip step ini jika hanya ingin menampilkan info dasar. Detail jarak & harga bisa ditambahkan nanti via link edit.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Info Tambahan */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-accentGreen mb-4">📦 Info Tambahan & RPC</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">URL Pendaftaran Resmi <span className="text-statusDanger">*</span></label>
                    <input 
                      type="url"
                      required
                      value={formData.url_pendaftaran}
                      onChange={(e) => setFormData({...formData, url_pendaftaran: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">URL Referensi (Bukti/Sumber Info)</label>
                    <input 
                      type="url"
                      value={formData.url_referensi}
                      onChange={(e) => setFormData({...formData, url_referensi: e.target.value})}
                      placeholder="https://instagram.com/..."
                      className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Detail Hadiah Juara / Podium</label>
                  <textarea 
                    rows={4}
                    value={formData.hadiah_juara}
                    onChange={(e) => setFormData({...formData, hadiah_juara: e.target.value})}
                    placeholder="Contoh: Juara 1: Rp 10jt + Trofi, Juara 2: Rp 5jt, dst..."
                    className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Fasilitas Unik / Kustom</label>
                  <input 
                    type="text"
                    value={formData.fasilitas_unik}
                    onChange={(e) => setFormData({...formData, fasilitas_unik: e.target.value})}
                    placeholder="Contoh: Kaos Kaki Lari, Dry Bag 5L, Voucher Belanja"
                    className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Promo / Diskon Komunitas</label>
                  <input 
                    type="text"
                    value={formData.promo_komunitas}
                    onChange={(e) => setFormData({...formData, promo_komunitas: e.target.value})}
                    placeholder="Contoh: Diskon 20% untuk grup minimal 10 orang"
                    className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                  />
                </div>

                <div className="border-t border-borderLight pt-6 mt-6">
                  <h3 className="text-lg font-bold text-white mb-4">📍 Info Race Pack Collection (RPC)</h3>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Lokasi RPC</label>
                    <input 
                      type="text"
                      value={formData.rpc_lokasi}
                      onChange={(e) => setFormData({...formData, rpc_lokasi: e.target.value})}
                      placeholder="Contoh: Plaza Senayan, Jakarta"
                      className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-2">Tanggal Mulai RPC</label>
                      <input 
                        type="date"
                        value={formData.rpc_tanggal_mulai}
                        onChange={(e) => setFormData({...formData, rpc_tanggal_mulai: e.target.value})}
                        className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-2">Tanggal Selesai RPC</label>
                      <input 
                        type="date"
                        value={formData.rpc_tanggal_selesai}
                        onChange={(e) => setFormData({...formData, rpc_tanggal_selesai: e.target.value})}
                        className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-textSecondary mb-2">Syarat & Detail RPC</label>
                    <textarea 
                      rows={3}
                      value={formData.rpc_detail}
                      onChange={(e) => setFormData({...formData, rpc_detail: e.target.value})}
                      placeholder="Contoh: Bawa KTP asli, bukti pembayaran, dan email konfirmasi"
                      className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Kontak & Konfirmasi */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-accentGreen mb-4">✅ Kontak Panitia & Konfirmasi</h2>
                
                <div className="bg-statusInfo/20 border border-statusInfo rounded-lg p-4 mb-6">
                  <p className="text-sm text-statusInfo">
                    <strong>Penting:</strong> Data kontak ini bersifat internal dan tidak akan dipublikasikan. Digunakan untuk keperluan verifikasi dan pengiriman link edit mandiri ke email Anda.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Nama Perwakilan Panitia <span className="text-statusDanger">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={formData.nama_pengirim}
                    onChange={(e) => setFormData({...formData, nama_pengirim: e.target.value})}
                    placeholder="Nama lengkap Anda"
                    className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Email <span className="text-statusDanger">*</span></label>
                    <input 
                      type="email" 
                      required
                      value={formData.email_pengirim}
                      onChange={(e) => setFormData({...formData, email_pengirim: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" 
                    />
                    <p className="text-xs text-textMuted mt-1">Link edit akan dikirim ke email ini</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">No. WhatsApp <span className="text-statusDanger">*</span></label>
                    <input 
                      type="tel" 
                      required
                      value={formData.whatsapp_pengirim}
                      onChange={(e) => setFormData({...formData, whatsapp_pengirim: e.target.value})}
                      placeholder="08123456789"
                      className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" 
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-borderLight">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={formData.consent_privasi}
                      onChange={(e) => setFormData({...formData, consent_privasi: e.target.checked})}
                      className="mt-1 accent-accentGreen w-5 h-5 flex-shrink-0" 
                    />
                    <span className="text-sm text-textSecondary leading-relaxed">
                      Saya menyatakan bahwa informasi event ini adalah benar dan akurat. Saya menyetujui <span className="text-accentGreen font-medium">Syarat & Ketentuan</span> dan memberikan izin kepada infopelari.id untuk menyimpan data kontak saya sesuai dengan <span className="text-accentGreen font-medium">Kebijakan Privasi</span> (UU PDP Indonesia).
                    </span>
                  </label>
                </div>

                <div className="bg-bgTertiary/50 border border-borderLight rounded-lg p-6 mt-6">
                  <h4 className="font-bold text-white mb-3">📧 Apa yang terjadi setelah submit?</h4>
                  <ul className="space-y-2 text-sm text-textSecondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accentGreen mt-0.5">✓</span>
                      <span>Event Anda masuk ke antrean moderasi Admin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accentGreen mt-0.5">✓</span>
                      <span>Anda akan menerima email konfirmasi berisi <strong>Secure Edit Link</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accentGreen mt-0.5">✓</span>
                      <span>Setelah disetujui Admin, event akan tayang di website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accentGreen mt-0.5">✓</span>
                      <span>Anda bisa edit event kapan saja menggunakan link tersebut (sampai Hari H)</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-borderLight">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={handlePrev} 
                  disabled={loading}
                  className="px-6 py-2 rounded text-textSecondary hover:text-white hover:bg-bgTertiary transition-colors disabled:opacity-50"
                >
                  Kembali
                </button>
              ) : (
                <div></div>
              )}
              
              {step < 5 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  disabled={loading}
                  className="px-6 py-2 rounded bg-bgTertiary text-white hover:bg-accentGreen hover:text-bgPrimary transition-colors font-bold neon-border disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-2 rounded bg-accentGreen text-bgPrimary font-bold hover:bg-accentYellow transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mengirim...' : 'Submit Event'}
                </button>
              )}
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
