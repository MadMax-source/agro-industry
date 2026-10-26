import Link from 'next/link'
import { WhatsAppChatButton } from '@/components/shared/whatsapp-chat-button'

export function ContactCta() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 rounded-2xl bg-accent px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12">
        <div className="max-w-xl">
          <h2 id="cta-title" className="font-heading text-2xl font-bold tracking-tight text-balance text-accent-foreground md:text-3xl">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="mt-2 leading-relaxed text-accent-foreground/80">
            Our catalogue is growing. Send us the product name or what you need it for, and we&apos;ll check availability for you.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <WhatsAppChatButton
            message="Hello Funalom Enterprises, I'm looking for a product that isn't on your website."
            className="h-12 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
          >
            Ask on WhatsApp
          </WhatsAppChatButton>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-accent-foreground/20 bg-card px-6 font-semibold text-foreground hover:bg-card/80"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
