'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { BrandLogo } from '@/components/layout/brand-logo'
import { usePublicCategories, useSettings } from '@/hooks/use-storefront'

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  const settings = useSettings()
  const categories = usePublicCategories()

  return (
    <footer className="bg-brand-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <BrandLogo inverted />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/75">{settings.footerDescription}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary-foreground px-5 text-sm font-semibold text-brand-deep transition-colors hover:bg-primary-foreground/90"
          >
            Get in touch
          </Link>
        </div>

        <FooterColumn title="Quick Links" className="lg:col-span-2">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Categories" className="lg:col-span-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="text-primary-foreground/75 transition-colors hover:text-primary-foreground"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact" className="lg:col-span-3">
          <li className="flex items-start gap-3 text-primary-foreground/75">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{settings.location}</span>
          </li>
          <li>
            <a
              href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}
              className="flex items-start gap-3 text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {settings.contactPhone}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-start gap-3 break-all text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {settings.contactEmail}
            </a>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-primary-foreground/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            {'© '}
            {new Date().getFullYear()} {settings.businessName}. All rights reserved.
          </p>
          <p>Always read and follow product labels before use.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <h2 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3 text-sm">{children}</ul>
    </div>
  )
}
