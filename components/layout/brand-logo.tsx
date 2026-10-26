import Link from 'next/link'
import { Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandLogo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-2.5 rounded-md', className)}
      aria-label="Funalom Enterprises home"
    >
      <span
        className={cn(
          'flex size-9 items-center justify-center rounded-lg transition-transform group-hover:-rotate-6',
          inverted ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground',
        )}
        aria-hidden="true"
      >
        <Sprout className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-lg font-extrabold tracking-tight',
            inverted ? 'text-primary-foreground' : 'text-foreground',
          )}
        >
          Funalom
        </span>
        <span
          className={cn(
            'text-[0.65rem] font-semibold uppercase tracking-[0.2em]',
            inverted ? 'text-primary-foreground/70' : 'text-muted-foreground',
          )}
        >
          Enterprises
        </span>
      </span>
    </Link>
  )
}
