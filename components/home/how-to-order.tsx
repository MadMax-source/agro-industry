import { MessageCircle, MousePointerClick, Search } from 'lucide-react'

const STEPS = [
  { icon: Search, title: 'Find your product', description: 'Browse by category or search by name, brand, or active ingredient.' },
  { icon: MousePointerClick, title: 'Tap "Buy on WhatsApp"', description: 'We pre-fill your order with the product, pack size, price, and quantity.' },
  { icon: MessageCircle, title: 'Confirm with our team', description: 'Send the message and we confirm availability, payment, and delivery.' },
]

export function HowToOrder() {
  return (
    <section aria-labelledby="how-title" className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-earth">How ordering works</p>
          <h2 id="how-title" className="font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Order in three simple steps
          </h2>
          <p className="mt-3 leading-relaxed text-pretty text-primary-foreground/80">
            No account or checkout needed. Every order is handled personally by our team on WhatsApp.
          </p>
        </div>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="relative flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">Step {index + 1}</p>
                <h3 className="mt-1 font-heading text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
