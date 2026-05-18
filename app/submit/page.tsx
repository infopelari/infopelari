'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function SubmitEventPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    namaEvent: '',
    tanggalMulai: '',
    lokasi: '',
    deskripsi: '',
    namaPengirim: '',
    emailPengirim: '',
    waPengirim: '',
    consentPrivasi: false
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    alert('Formulir berhasil disubmit! Event masuk ke antrean Admin.');
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12">
        <div className="mb-8 border-b border-borderLight pb-6">
          <h1 className="text-3xl font-extrabold text-white mb-2">Pasang Event Lari</h1>
          <p className="text-textSecondary">Isi detail event Anda di bawah ini. Tim kami akan memverifikasi sebelum ditayangkan.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-bgTertiary -z-10 rounded"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accentGreen -z-10 rounded transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= num ? 'bg-bgPrimary border-accentGreen text-accentGreen shadow-[0_0_10px_rgba(57,255,20,0.5)]' : 'bg-bgSecondary border-borderLight text-textMuted'}`}>
              {num}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-bgSecondary border border-borderLight rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: Info Dasar */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-accentGreen mb-4">Informasi Dasar Event</h2>
                
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Nama Event *</label>
                  <input type="text" required placeholder="Contoh: Jakarta Marathon 2026" className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Tanggal Pelaksanaan *</label>
                    <input type="date" required className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Kota Lokasi *</label>
                    <input type="text" required placeholder="Contoh: Jakarta Pusat" className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Tipe Event</label>
                  <div className="flex flex-wrap gap-3">
                    {['Road Run', 'Trail Run', 'Virtual Run', 'Charity Run'].map((type) => (
                      <label key={type} className="flex items-center gap-2 bg-bgTertiary px-4 py-2 rounded cursor-pointer border border-transparent hover:border-accentGreen">
                        <input type="checkbox" className="accent-accentGreen w-4 h-4" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Detail & Jarak */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-accentGreen mb-4">Kategori Jarak & Poster</h2>
                
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Kategori Jarak (Bisa pilih lebih dari satu)</label>
                  <div className="flex flex-wrap gap-3">
                    {['5K', '10K', 'Half Marathon', 'Full Marathon', 'Ultra'].map((jarak) => (
                      <label key={jarak} className="flex items-center gap-2 bg-bgTertiary px-4 py-2 rounded cursor-pointer border border-transparent hover:border-accentGreen">
                        <input type="checkbox" className="accent-accentGreen w-4 h-4" />
                        <span className="text-sm">{jarak}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Upload Poster Event *</label>
                  <div className="border-2 border-dashed border-borderLight rounded-lg p-8 flex flex-col items-center justify-center hover:border-accentGreen cursor-pointer transition-colors bg-bgTertiary">
                    <svg className="w-8 h-8 text-textMuted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-textSecondary text-center">Klik untuk upload atau drag & drop<br/>(Maks 2MB, JPG/PNG)</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Kontak & Konfirmasi */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-accentGreen mb-4">Kontak Panitia & Konfirmasi</h2>
                <div className="bg-bgTertiary/50 p-4 rounded border border-borderLight mb-6">
                  <p className="text-sm text-textSecondary">Data kontak ini bersifat internal dan tidak akan dipublikasikan. Digunakan untuk keperluan verifikasi dan pengiriman link edit mandiri.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Nama Perwakilan Panitia *</label>
                  <input type="text" required className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Email *</label>
                    <input type="email" required className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">No. WhatsApp *</label>
                    <input type="tel" required className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-borderLight">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="mt-1 accent-accentGreen w-5 h-5 flex-shrink-0" />
                    <span className="text-sm text-textSecondary leading-relaxed">
                      Saya menyatakan bahwa informasi event ini adalah benar. Saya menyetujui <span className="text-accentGreen">Syarat & Ketentuan</span> dan memberikan izin kepada infopelari.id untuk menyimpan data saya sesuai dengan kebijakan privasi.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-borderLight">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="px-6 py-2 rounded text-textSecondary hover:text-white hover:bg-bgTertiary transition-colors">
                  Kembali
                </button>
              ) : (
                <div></div> // Spacer
              )}
              
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="px-6 py-2 rounded bg-bgTertiary text-white hover:bg-accentGreen hover:text-bgPrimary transition-colors font-bold neon-border">
                  Selanjutnya
                </button>
              ) : (
                <button type="submit" className="px-8 py-2 rounded bg-accentGreen text-bgPrimary font-bold hover:bg-accentYellow transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                  Submit Event
                </button>
              )}
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
