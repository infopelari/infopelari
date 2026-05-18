import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-bgPrimary/90 backdrop-blur-md border-b border-borderLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-outfit font-bold text-2xl tracking-tighter text-white">
                INFO<span className="text-accentGreen">PELARI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari event (ex: Bandung Marathon)..." 
                className="w-64 bg-bgSecondary text-sm rounded-full px-4 py-2 border border-borderLight focus:outline-none focus:border-accentGreen transition-colors"
              />
              <svg className="w-4 h-4 text-textMuted absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <Link href="/events" className="text-sm font-medium text-textSecondary hover:text-white transition-colors">
              Cari Event
            </Link>
            
            <button className="text-sm font-medium text-textSecondary hover:text-white transition-colors">
              About Us
            </button>
            
            <Link 
              href="/submit" 
              className="px-4 py-2 text-sm font-bold text-bgPrimary bg-accentGreen rounded-full hover:bg-accentYellow transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            >
              Posting Event
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-textSecondary hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
