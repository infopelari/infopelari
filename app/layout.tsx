import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

// Load fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'infopelari.id - Portal Informasi Event Lari Indonesia',
  description: 'Jadwal event lari, marathon, fun run, dan trail run terlengkap di Indonesia.',
  openGraph: {
    title: 'infopelari.id - Portal Informasi Event Lari Indonesia',
    description: 'Jadwal event lari terlengkap di Indonesia.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
