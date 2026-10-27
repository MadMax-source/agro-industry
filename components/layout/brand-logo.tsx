import Link from 'next/link'
import { cn } from '@/lib/utils'

export function BrandLogo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-2.5 rounded-md', className)}
      aria-label="The Funalom Enterprise home"
    >
      <span
        className={cn(
          'flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
          inverted ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground',
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 48" className="size-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 37V11h21v6H21v5h11v6H21v9h-7Z"
            fill="currentColor"
          />
          <path d="M25 34c4.8 0 8.2-1 11-3.2M26 38c3.4 0 6.4-.5 9-1.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="36" cy="12" r="3.5" className="fill-earth" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-lg font-bold tracking-tight',
            inverted ? 'text-primary-foreground' : 'text-foreground',
          )}
        >
          The Funalom
        </span>
        <span
          className={cn(
            'text-[0.65rem] font-semibold uppercase tracking-[0.2em]',
            inverted ? 'text-primary-foreground/70' : 'text-muted-foreground',
          )}
        >
          Enterprise
        </span>
      </span>
    </Link>
  )
}
