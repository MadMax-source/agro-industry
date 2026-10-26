import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  id?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, description, action, id, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        )}
        <h2 id={id} className="font-heading text-3xl font-bold tracking-tight text-balance text-foreground md:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
