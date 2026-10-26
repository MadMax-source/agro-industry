import { StorefrontShell } from '@/components/layout/storefront-shell'

export default function StoreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <StorefrontShell>{children}</StorefrontShell>
}
