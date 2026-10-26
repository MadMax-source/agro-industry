import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: {
    default: 'Funalom Enterprises | Agricultural Inputs & Agrochemicals in Lagos',
    template: '%s | Funalom Enterprises',
  },
  description:
    'Shop quality fertilizers, crop protection products, seeds, plant growth regulators, and farm essentials from Funalom Enterprises in Lagos, Nigeria. Order easily via WhatsApp.',
  keywords: [
    'agro store Lagos',
    'fertilizers Nigeria',
    'agrochemicals',
    'herbicides',
    'pesticides',
    'seeds',
    'Funalom Enterprises',
  ],
  openGraph: {
    title: 'Funalom Enterprises',
    description: 'Your trusted partner in modern agriculture. Order agricultural inputs via WhatsApp.',
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
    <html lang="en" className={`${inter.variable} ${manrope.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
