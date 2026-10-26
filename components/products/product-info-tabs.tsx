'use client'

import { useId, useState, type KeyboardEvent } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

export function ProductInfoTabs({ product }: { product: Product }) {
  const baseId = useId()
  const tabs = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'usage', label: 'Usage', content: product.usageInfo },
    { id: 'safety', label: 'Safety', content: product.safetyInfo },
    { id: 'storage', label: 'Storage', content: product.storageInfo },
  ].filter((tab): tab is { id: string; label: string; content: string } => !!tab.content?.trim())

  const [active, setActive] = useState(0)
  const current = tabs[Math.min(active, tabs.length - 1)]
  if (!current) return null

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    event.preventDefault()
    const next = (active + delta + tabs.length) % tabs.length
    setActive(next)
    document.getElementById(`${baseId}-tab-${tabs[next].id}`)?.focus()
  }

  return (
    <section aria-label="Product information" className="mt-14">
      <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((tab, index) => {
          const selected = tab.id === current.id
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={handleKeyDown}
              className={cn(
                '-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                selected ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="max-w-3xl py-6"
      >
        {current.id === 'safety' && (
          <p className="mb-4 flex items-start gap-2 rounded-lg bg-accent p-3 text-sm font-medium text-accent-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Always follow the manufacturer&apos;s label instructions.
          </p>
        )}
        <p className="whitespace-pre-line leading-relaxed text-pretty text-muted-foreground">{current.content}</p>
      </div>
    </section>
  )
}
