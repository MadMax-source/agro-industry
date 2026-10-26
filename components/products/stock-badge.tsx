import { getStockStatus, STOCK_LABELS } from '@/lib/catalog'
import { cn } from '@/lib/utils'

const STYLES = {
  'in-stock': 'bg-primary/10 text-primary ring-primary/20',
  'low-stock': 'bg-accent text-accent-foreground ring-earth/40',
  'out-of-stock': 'bg-destructive/10 text-destructive ring-destructive/20',
} as const

export function StockBadge({ stock, showCount = false, className }: { stock: number; showCount?: boolean; className?: string }) {
  const status = getStockStatus(stock)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STOCK_LABELS[status]}
      {showCount && status !== 'out-of-stock' && <span className="font-normal opacity-80">({stock} units)</span>}
    </span>
  )
}
