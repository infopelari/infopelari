import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TestDBPage() {
  let success = false
  let errorMessage = ''
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Belum diisi'

  try {
    const supabase = await createClient()
    // Test database query
    const { error } = await supabase.from('events').select('id').limit(1)
    
    if (error) {
      success = false
      errorMessage = error.message
    } else {
      success = true
    }
  } catch (err: any) {
    success = false
    errorMessage = err.message || 'Kesalahan sistem saat menghubungkan.'
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#151D30] rounded-2xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full filter blur-[80px] opacity-35 ${success ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        
        <div className="text-center relative z-10">
          {success ? (
            <>
              {/* Success Icon */}
              <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-400/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(16,185,129,0.2)] animate-pulse">
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-extrabold text-white mb-2">
                KONEKSI BERHASIL! 🎉
              </h1>
              
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Website lokal Anda telah sukses terhubung ke database Supabase dengan aman.
              </p>
            </>
          ) : (
            <>
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-500/10 border-2 border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
                <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-extrabold text-white mb-2">
                KONEKSI GAGAL ❌
              </h1>
              
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Website gagal terhubung ke database. Harap periksa kembali kunci pada file <code className="bg-gray-900 px-1.5 py-0.5 rounded text-red-400">.env.local</code> Anda.
              </p>
            </>
          )}

          {/* Info Details */}
          <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800 text-left mb-8 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Database URL</span>
              <span className="text-xs text-gray-300 font-mono break-all">{projectUrl}</span>
            </div>
            
            {success ? (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Status Respon</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block mr-1"></span>
                  Terhubung & Siap Digunakan
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Pesan Error</span>
                <span className="text-xs text-red-400 font-mono block mt-0.5 leading-relaxed bg-red-950/20 p-2 rounded border border-red-900/30">
                  {errorMessage}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Link 
            href="/"
            className="inline-block w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-sm rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
