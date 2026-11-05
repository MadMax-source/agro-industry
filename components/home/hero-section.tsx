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
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-earth/90" aria-hidden="true">
        <motion.div
          className="absolute -left-16 -top-20 size-80 rounded-full bg-lime/25 blur-3xl"
          animate={{ x: [0, 90, 20, 0], y: [0, 35, 100, 0], scale: [1, 1.18, 0.92, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-28 right-0 size-[28rem] rounded-full bg-sky-300/15 blur-3xl"
          animate={{ x: [0, -70, -20, 0], y: [0, -45, 35, 0], scale: [1, 0.9, 1.15, 1] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 size-56 rounded-full bg-amber-200/10 blur-3xl"
          animate={{ x: [-20, 80, -40, -20], y: [0, 50, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
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
