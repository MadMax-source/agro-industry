import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, Sprout } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: 'Genuine products' },
  { icon: Sprout, label: 'Expert guidance' },
  { icon: Truck, label: 'Lagos & nationwide' },
]

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-primary">
      <Image
        src="/images/hero-farm.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/85 to-primary/30" aria-hidden="true" />

      <div className="mx-auto flex max-w-7xl flex-col px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground ring-1 ring-inset ring-primary-foreground/20">
            <span className="size-1.5 rounded-full bg-earth" aria-hidden="true" />
            Funalom Enterprises · Lagos
          </p>
          <h1
            id="hero-title"
            className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-balance text-primary-foreground sm:text-5xl lg:text-6xl"
          >
            Your trusted partner in modern agriculture
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-primary-foreground/85">
            Quality fertilizers, crop protection products, seeds, and farm essentials for farmers, agro-dealers, and
            agribusinesses. Browse the catalogue and order in seconds on WhatsApp.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 text-base font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
            >
              Shop Products
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-primary-foreground/40 px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Our Story
            </Link>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-primary-foreground/90">
                <Icon className="size-4 text-earth" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
