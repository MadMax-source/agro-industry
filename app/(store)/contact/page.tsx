import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { ContactDetails } from '@/components/contact/contact-details'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Reach Funalom Enterprises on WhatsApp, phone, or email, or visit our store in Ikeja, Lagos.',
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Questions about a product, bulk pricing, or delivery? We usually reply on WhatsApp within business hours."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <ContactDetails />
        </div>
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </>
  )
}
