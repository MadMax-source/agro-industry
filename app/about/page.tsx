import type { Metadata } from 'next'
import Image from 'next/image'
import { Eye, HandHeart, Target } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { ContactCta } from '@/components/home/contact-cta'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Funalom Enterprises supplies quality agricultural inputs to farmers, agro-dealers, and agribusinesses from Lagos, Nigeria.',
}

const VALUES = [
  {
    icon: Target,
    title: 'Our mission',
    description:
      'To make quality agricultural inputs accessible and affordable, helping every farmer we serve grow healthier crops and better yields.',
  },
  {
    icon: Eye,
    title: 'Our vision',
    description:
      'To be one of the most trusted agricultural input suppliers in Nigeria, known for genuine products and honest service.',
  },
  {
    icon: HandHeart,
    title: 'Our promise',
    description:
      'Authentic products, clear pricing, and practical support — whether you are buying a single pack or stocking an agro-dealer outlet.',
  },
]

const SERVE = ['Smallholder farmers', 'Commercial farms', 'Agro-dealers & retailers', 'Cooperatives & agribusinesses']

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Funalom Enterprises"
        description="Your trusted partner in modern agriculture, serving farmers from Lagos, Nigeria."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
          <Image
            src="/images/about-store.png"
            alt="Shelves of fertilizers, seeds, and crop protection products inside the Funalom Enterprises store"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Who we are</p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance text-foreground md:text-4xl">
            Rooted in Lagos, growing with Nigerian agriculture
          </h2>
          <div className="mt-5 flex flex-col gap-4 leading-relaxed text-pretty text-muted-foreground">
            <p>
              Funalom Enterprises is an agricultural input supplier based in Ikeja, Lagos. We stock fertilizers,
              herbicides, pesticides, fungicides, seeds, plant growth regulators, soil conditioners, and essential farm
              tools.
            </p>
            <p>
              We believe that the right inputs, used the right way, make a real difference on the farm. That is why we
              focus on genuine products from reputable manufacturers and take time to understand what each customer needs.
            </p>
          </div>
          <h3 className="mt-8 font-heading text-base font-bold text-foreground">Who we serve</h3>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SERVE.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Mission, vision and promise" className="bg-secondary/60">
        <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-8">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="rounded-xl border border-border bg-card p-7">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-heading text-xl font-bold text-foreground">{title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <ContactCta />
    </>
  )
}
