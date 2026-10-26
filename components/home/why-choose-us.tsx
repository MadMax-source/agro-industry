import { BadgeCheck, Headset, PackageCheck, Wallet } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'

const REASONS = [
  {
    icon: BadgeCheck,
    title: 'Genuine, quality products',
    description: 'We source from reputable manufacturers and distributors, so you get authentic inputs every time.',
  },
  {
    icon: Headset,
    title: 'Knowledgeable support',
    description: 'Not sure what to use? Chat with us and we will help you find a suitable product for your needs.',
  },
  {
    icon: Wallet,
    title: 'Fair, transparent pricing',
    description: 'Clear per-pack prices with competitive rates for bulk buyers, agro-dealers, and cooperatives.',
  },
  {
    icon: PackageCheck,
    title: 'Reliable fulfilment',
    description: 'Orders are confirmed quickly on WhatsApp and prepared for pickup or delivery within Lagos and beyond.',
  },
]

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        id="why-title"
        eyebrow="Why Funalom"
        title="Growing with Nigerian farmers"
        description="We are more than a store. We help farmers and agribusinesses get the right inputs, at the right time."
      />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="rounded-xl border border-border bg-card p-6">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-heading text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
