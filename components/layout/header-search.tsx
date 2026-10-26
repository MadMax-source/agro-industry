'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function HeaderSearch({ onSubmitted }: { onSubmitted?: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products')
    onSubmitted?.()
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2 px-4 py-4 sm:px-6">
      <label htmlFor="header-search-input" className="sr-only">
        Search products
      </label>
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="header-search-input"
          type="search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by product name, brand, or active ingredient"
          className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30"
        />
      </div>
      <button
        type="submit"
        className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Search
      </button>
    </form>
  )
}
