import { StorefrontShell } from '@/components/layout/storefront-shell'
import { NotFoundState } from '@/components/shared/not-found-state'

export default function NotFound() {
  return (
    <StorefrontShell>
      <NotFoundState
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        action={{ href: '/products', label: 'Browse products' }}
      />
    </StorefrontShell>
  )
}
