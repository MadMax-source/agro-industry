import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: {
    default: 'The Funalom Enterprises | Agricultural Inputs & Agrochemicals in Abuja',
    template: '%s | The Funalom Enterprises',
  },
  description:
    'Shop quality fertilizers, crop protection products, seeds, plant growth regulators, and farm essentials from The Funalom Enterprises in Abuja, Nigeria.',
  keywords: [
    'agro store Abuja',
    'fertilizers Nigeria',
    'agrochemicals',
    'herbicides',
    'pesticides',
    'seeds',
    'The Funalom Enterprises',
  ],
  openGraph: {
    title: 'The Funalom Enterprises',
    description: 'Your trusted partner in modern agriculture. Quality agricultural inputs from Abuja, Nigeria.',
    type: 'website',
    locale: 'en_NG',
    images: ['/images/hero-farm.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#1f5c3d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
