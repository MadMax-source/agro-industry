'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, Sprout, Bird } from 'lucide-react'
import { motion } from 'motion/react'

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: 'Genuine products' },
  { icon: Sprout, label: 'Crop solutions' },
  { icon: Bird, label: 'Livestock & feeds' },
  { icon: Truck, label: 'Abuja & nationwide' },
]

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_15%_20%,color-mix(in_oklab,var(--earth)_28%,transparent),transparent_34%),radial-gradient(circle_at_88%_18%,color-mix(in_oklab,var(--primary-foreground)_13%,transparent),transparent_30%),linear-gradient(120deg,var(--primary),color-mix(in_oklab,var(--primary)_72%,var(--earth)))]" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 80, -24, 0], y: [0, 34, -18, 0], scale: [1, 1.15, 0.96, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 top-8 size-96 rounded-full bg-earth/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -90, 20, 0], y: [0, 28, -36, 0], scale: [1, 0.9, 1.12, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-20 top-0 size-[30rem] rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-28 -top-28 size-96 rounded-full border border-primary-foreground/15"
        />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,transparent_0%,var(--earth)_48%,transparent_50%)] [background-size:14rem_14rem]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground ring-1 ring-inset ring-primary-foreground/20">
            <span className="size-1.5 rounded-full bg-earth" aria-hidden="true" />
            The Funalom Enterprise · Abuja
          </motion.p>
          <h1
            id="hero-title"
            className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-balance text-primary-foreground sm:text-5xl lg:text-6xl"
          >
            Your trusted partner in modern agriculture
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-primary-foreground/85">
            Quality inputs for thriving crops and healthy livestock — from fertilizers and seeds to poultry feeds, farm essentials, and professional fumigation. Browse the catalogue and order in seconds on WhatsApp.
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
