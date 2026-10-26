import Link from 'next/link'
import { Sprout } from 'lucide-react'

interface NotFoundStateProps {
  title: string
  description: string
  action?: { href: string; label: string }
}

export function NotFoundState({ title, description, action = { href: '/', label: 'Back to home' } }: NotFoundStateProps) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <Sprout className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={action.href}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {action.label}
        </Link>
        {action.href !== '/' && (
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 font-semibold text-foreground hover:bg-secondary"
          >
            Go home
          </Link>
        )}
      </div>
    </section>
  )
}
