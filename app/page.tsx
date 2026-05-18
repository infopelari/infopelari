import Navbar from '@/components/Navbar'

export default function Home() {
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
          
          {/* Mock Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-bgSecondary rounded-xl overflow-hidden border border-borderLight hover:border-accentGreen transition-colors group">
                <div className="aspect-[4/3] bg-bgTertiary relative">
                  {/* Mock Image Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-textMuted">Poster Event</div>
                  <div className="absolute top-3 right-3 bg-accentGreen text-bgPrimary text-xs font-bold px-2 py-1 rounded">Road Run</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-textSecondary">24 Agustus 2026</span>
                    <span className="w-1 h-1 rounded-full bg-textMuted"></span>
                    <span className="text-xs text-textSecondary">Jakarta</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-accentGreen transition-colors">Jakarta International Marathon {i}</h3>
                  <p className="text-sm text-textSecondary mb-4 line-clamp-2">
                    Event lari terbesar di ibu kota dengan rute steril yang melewati ikon-ikon kota Jakarta. Tersedia berbagai kategori jarak.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-bgTertiary text-xs rounded text-textSecondary">5K</span>
                    <span className="px-2 py-1 bg-bgTertiary text-xs rounded text-textSecondary">10K</span>
                    <span className="px-2 py-1 bg-bgTertiary text-xs rounded text-textSecondary">HM</span>
                    <span className="px-2 py-1 bg-bgTertiary text-xs rounded text-textSecondary">FM</span>
                  </div>
                </div>
              </div>
            ))}
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
