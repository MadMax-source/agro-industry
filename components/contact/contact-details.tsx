'use client'

import type { ReactNode } from 'react'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useSettings } from '@/hooks/use-storefront'
import { WhatsAppChatButton } from '@/components/shared/whatsapp-chat-button'

export function ContactDetails() {
  const settings = useSettings()

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-primary p-6 text-primary-foreground">
        <h2 className="font-heading text-xl font-bold">Fastest response: WhatsApp</h2>
        <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
          Send us a message with the product you need and we&apos;ll confirm price and availability.
        </p>
        <WhatsAppChatButton className="mt-5 h-11 w-full bg-primary-foreground px-5 text-primary hover:bg-primary-foreground/90" />
      </div>

      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        <DetailRow icon={<Phone className="size-5" aria-hidden="true" />} label="Phone">
          <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="hover:text-primary hover:underline">
            {settings.contactPhone}
          </a>
        </DetailRow>
        <DetailRow icon={<Mail className="size-5" aria-hidden="true" />} label="Email">
          <a href={`mailto:${settings.contactEmail}`} className="break-all hover:text-primary hover:underline">
            {settings.contactEmail}
          </a>
        </DetailRow>
        <DetailRow icon={<MapPin className="size-5" aria-hidden="true" />} label="Address">
          <address className="not-italic">{settings.address}</address>
        </DetailRow>
        <DetailRow icon={<Clock className="size-5" aria-hidden="true" />} label="Business hours">
          {settings.businessHours}
        </DetailRow>
      </ul>
    </div>
  )
}

function DetailRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 p-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="mt-1 text-sm font-medium leading-relaxed text-foreground">{children}</div>
      </div>
    </li>
  )
}
