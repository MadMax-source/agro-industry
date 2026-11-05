'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight, Bird, Bug, CircleDot, Droplets, Leaf, Sprout } from 'lucide-react'

const SERVICES = [
  { icon: Sprout, label: 'Crops', title: 'Grow with confidence', copy: 'Seeds, fertilizers and crop protection for stronger harvests.', tone: 'bg-[#d9f35b]' },
  { icon: Bird, label: 'Livestock', title: 'Healthy stock, better returns', copy: 'Poultry, feeds and everyday livestock essentials for your farm.', tone: 'bg-[#ffb347]' },
  { icon: Bug, label: 'Fumigation', title: 'Protect every space', copy: 'Professional fumigation for homes, farms, stores and businesses.', tone: 'bg-[#b7e4c7]' },
  { icon: Droplets, label: 'Farm services', title: 'Practical farm support', copy: 'Reliable advice and tools from planting to post-harvest.', tone: 'bg-[#f8d6c1]' },
]

export function AgricultureShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#173b2a] py-20 text-[#f4f5e9] sm:py-28">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,transparent_0%,transparent_47%,#d9f35b_48%,#d9f35b_51%,transparent_52%),linear-gradient(30deg,transparent_0%,transparent_48%,#f4f5e9_49%,#f4f5e9_50%,transparent_51%)] [background-size:88px_88px,110px_110px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#d9f35b]"><CircleDot className="size-3" aria-hidden="true" /> More than agrochemicals</p>
            <h2 className="font-heading text-4xl font-bold leading-[0.98] tracking-tight text-balance sm:text-6xl">One partner for your whole farm.</h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-[#f4f5e9]/70">From the soil beneath your feet to the animals in your care, we bring the right products and practical support together.</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, label, title, copy, tone }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }}
              className={`group relative min-h-64 overflow-hidden rounded-[1.75rem] p-6 text-[#173b2a] ${tone}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#173b2a]/10"><Icon className="size-6" aria-hidden="true" /></div>
                <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </div>
              <div className="absolute -bottom-8 -right-6 size-36 rounded-full border-[18px] border-[#173b2a]/10" aria-hidden="true" />
              <div className="relative mt-12">
                <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-60">{label}</p>
                <h3 className="mt-2 font-heading text-2xl font-bold leading-tight">{title}</h3>
                <p className="mt-2 max-w-[14rem] text-sm leading-relaxed opacity-70">{copy}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mt-5 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] border border-[#d9f35b]/30 bg-[#d9f35b] p-6 text-[#173b2a] sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4"><Leaf className="mt-1 size-6 shrink-0" aria-hidden="true" /><div><p className="font-heading text-2xl font-bold">Need help choosing?</p><p className="mt-1 text-sm opacity-75">Tell us what you are growing or raising and we will point you in the right direction.</p></div></div>
          <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#173b2a] px-5 py-3 text-sm font-bold text-[#f4f5e9] transition-transform hover:scale-105">Talk to an expert <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
        </motion.div>
      </div>
    </section>
  )
}
