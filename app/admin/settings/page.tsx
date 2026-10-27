import type { Metadata } from 'next'
import { AdminSettings } from '@/components/admin/admin-settings'

export const metadata: Metadata = { title: 'Business settings' }

export default function AdminSettingsPage() {
  return <AdminSettings />
}
