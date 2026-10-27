'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAdminCatalog } from '@/contexts/admin-catalog-context'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { FormField, FormSection } from '@/components/admin/form-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const settingsSchema = z.object({
  businessName: z.string().trim().min(1, 'Enter the business name.').max(160),
  tagline: z.string().trim().max(240),
  whatsappNumber: z.string().trim().min(1, 'Enter the WhatsApp number.').max(40),
  contactPhone: z.string().trim().min(1, 'Enter a contact phone number.').max(40),
  contactEmail: z.email('Enter a valid contact email address.'),
  location: z.string().trim().max(300),
  address: z.string().trim().max(300),
  businessHours: z.string().trim().max(300),
  footerDescription: z.string().trim().max(1000),
  whatsappGreeting: z.string().trim().max(500),
  whatsappTemplate: z.string().trim().max(2000),
})

type SettingsValues = z.infer<typeof settingsSchema>

export function AdminSettings() {
  const { settings, updateSettings } = useAdminCatalog()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings ?? undefined,
  })

  useEffect(() => {
    if (settings) reset(settings)
  }, [settings, reset])

  const onSubmit = async (values: SettingsValues) => {
    try {
      await updateSettings(values)
      toast.success('Business settings saved')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save business settings.')
    }
  }

  if (!settings) {
    return (
      <div role="alert" className="rounded-xl border border-dashed border-border bg-card p-8 text-sm text-muted-foreground">
        Business settings are not available yet. Check the backend connection and retry.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <AdminPageHeader title="Business settings" description="Manage the business details and contact templates used across the store." />

      <FormSection title="Business information">
        <FormField id="businessName" label="Business name" error={errors.businessName?.message}>
          <Input id="businessName" aria-invalid={!!errors.businessName} {...register('businessName')} />
        </FormField>
        <FormField id="tagline" label="Tagline" error={errors.tagline?.message}>
          <Input id="tagline" aria-invalid={!!errors.tagline} {...register('tagline')} />
        </FormField>
        <FormField id="location" label="Location" error={errors.location?.message}>
          <Input id="location" aria-invalid={!!errors.location} {...register('location')} />
        </FormField>
        <FormField id="address" label="Address" error={errors.address?.message}>
          <Input id="address" aria-invalid={!!errors.address} {...register('address')} />
        </FormField>
        <FormField id="businessHours" label="Business hours" error={errors.businessHours?.message}>
          <Input id="businessHours" aria-invalid={!!errors.businessHours} {...register('businessHours')} />
        </FormField>
        <FormField id="footerDescription" label="Footer description" error={errors.footerDescription?.message} className="sm:col-span-2">
          <Textarea id="footerDescription" rows={3} aria-invalid={!!errors.footerDescription} {...register('footerDescription')} />
        </FormField>
      </FormSection>

      <FormSection title="Contact details">
        <FormField id="contactPhone" label="Contact phone" error={errors.contactPhone?.message}>
          <Input id="contactPhone" type="tel" aria-invalid={!!errors.contactPhone} {...register('contactPhone')} />
        </FormField>
        <FormField id="contactEmail" label="Contact email" error={errors.contactEmail?.message}>
          <Input id="contactEmail" type="email" aria-invalid={!!errors.contactEmail} {...register('contactEmail')} />
        </FormField>
        <FormField id="whatsappNumber" label="WhatsApp number" hint="International format, digits only." error={errors.whatsappNumber?.message}>
          <Input id="whatsappNumber" type="tel" aria-invalid={!!errors.whatsappNumber} {...register('whatsappNumber')} />
        </FormField>
      </FormSection>

      <FormSection title="WhatsApp messages">
        <FormField id="whatsappGreeting" label="General enquiry greeting" error={errors.whatsappGreeting?.message} className="sm:col-span-2">
          <Textarea id="whatsappGreeting" rows={2} aria-invalid={!!errors.whatsappGreeting} {...register('whatsappGreeting')} />
        </FormField>
        <FormField
          id="whatsappTemplate"
          label="Product order template"
          hint="Available placeholders: {businessName}, {productName}, {quantity}, {price}, {subtotal}, and {productUrl}."
          error={errors.whatsappTemplate?.message}
          className="sm:col-span-2"
        >
          <Textarea id="whatsappTemplate" rows={5} aria-invalid={!!errors.whatsappTemplate} {...register('whatsappTemplate')} />
        </FormField>
      </FormSection>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
        >
          {isSubmitting ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}
