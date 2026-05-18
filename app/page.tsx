import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { formatTanggalIndo, truncateText } from '@/lib/utils'
import Link from 'next/link'
import type { Event } from '@/types/database'

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch published events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('tanggal_mulai', { ascending: true })
    .limit(12)

  const eventList = (events || []) as Event[]

  return (
    <>
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[50vh] md:h-[70vh] bg-bgSecondary flex items-center justify-center border-b border-borderLight overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary to-transparent"></div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              Temukan <span className="text-gradient">Event Lari</span> Terbaik di Indonesia
            </h1>
            <p className="text-lg md:text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
              Dari Fun Run hingga Ultra Marathon. Jadwal terlengkap, akurat, dan terpercaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 text-sm font-bold text-bgPrimary bg-accentGreen rounded-full hover:bg-accentYellow transition-colors shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                Lihat Jadwal Terdekat
              </button>
              <button className="px-8 py-3 text-sm font-bold text-white bg-bgTertiary border border-borderLight rounded-full hover:border-accentGreen transition-colors neon-border">
                Pasang Event Anda
              </button>
            </div>
          </div>
        </section>

        {/* Filters & Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8 border-b border-borderLight pb-4">
            <h2 className="text-2xl font-bold">Event Mendatang</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm rounded bg-bgTertiary text-white border border-borderLight hover:border-accentGreen">Card View</button>
              <button className="px-4 py-2 text-sm rounded bg-transparent text-textSecondary border border-transparent hover:text-white">Calendar</button>
            </div>
          </div>
          
          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventList.length > 0 ? (
              eventList.map((event) => (
                <Link 
                  key={event.id} 
                  href={`/events/${event.slug}`}
                  className="bg-bgSecondary rounded-xl overflow-hidden border border-borderLight hover:border-accentGreen transition-colors group"
                >
                  <div className="aspect-square bg-bgTertiary relative overflow-hidden">
                    {event.poster_url ? (
                      <img 
                        src={event.poster_url} 
                        alt={event.nama_event}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-textMuted">
                        Poster Event
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {event.tipe_event[0] && (
                        <span className="bg-accentGreen text-bgPrimary text-xs font-bold px-2 py-1 rounded">
                          {event.tipe_event[0]}
                        </span>
                      )}
                      {event.is_verified && (
                        <span className="bg-statusInfo text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Status Warning */}
                    {event.status_penyelenggaraan !== 'normal' && (
                      <div className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded ${
                        event.status_penyelenggaraan === 'diundur' 
                          ? 'bg-statusWarning text-bgPrimary' 
                          : 'bg-statusDanger text-white'
                      }`}>
                        {event.status_penyelenggaraan.toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-textSecondary">
                        {event.is_tentative ? 'TBC' : formatTanggalIndo(event.tanggal_mulai)}
                      </span>
                      {event.kota_id && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-textMuted"></span>
                          <span className="text-xs text-textSecondary">{event.kota_id}</span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 group-hover:text-accentGreen transition-colors line-clamp-2">
                      {event.nama_event}
                    </h3>
                    
                    {event.deskripsi && (
                      <p className="text-sm text-textSecondary mb-4 line-clamp-2">
                        {truncateText(event.deskripsi, 120)}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {event.kategori_jarak.slice(0, 4).map((jarak) => (
                        <span key={jarak} className="px-2 py-1 bg-bgTertiary text-xs rounded text-textSecondary">
                          {jarak}
                        </span>
                      ))}
                      {event.kategori_jarak.length > 4 && (
                        <span className="px-2 py-1 bg-bgTertiary text-xs rounded text-textSecondary">
                          +{event.kategori_jarak.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-textMuted">Belum ada event yang dipublikasikan.</p>
                <Link 
                  href="/submit"
                  className="inline-block mt-4 px-6 py-2 bg-accentGreen text-bgPrimary rounded-full font-bold hover:bg-accentYellow transition-colors"
                >
                  Pasang Event Pertama
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-borderLight bg-bgSecondary py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-textSecondary">
          <p className="mb-4">© 2026 infopelari.id. All rights reserved.</p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="#" className="hover:text-accentGreen transition-colors">Instagram</a>
            <a href="#" className="hover:text-accentGreen transition-colors">TikTok</a>
            <a href="#" className="hover:text-accentGreen transition-colors">Strava</a>
          </div>
        </div>
      </footer>
    </>
  )
}
