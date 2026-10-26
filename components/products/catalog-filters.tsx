'use client'

import { ChevronDown, Search, X } from 'lucide-react'
import type { AvailabilityFilter, CatalogFilters as Filters, Category, SortOption } from '@/types'
import { SORT_OPTIONS } from '@/lib/catalog'

interface CatalogFiltersProps {
  filters: Filters
  categories: Category[]
  hideCategory?: boolean
  onChange: (next: Partial<Filters>) => void
}

const AVAILABILITY: { value: AvailabilityFilter; label: string }[] = [
  { value: 'all', label: 'All availability' },
  { value: 'available', label: 'In stock only' },
  { value: 'out-of-stock', label: 'Out of stock' },
]

export function CatalogFilters({ filters, categories, hideCategory, onChange }: CatalogFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <label htmlFor="catalog-search" className="sr-only">
          Search products
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="catalog-search"
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Search name, brand, or active ingredient"
          className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => onChange({ query: '' })}
            className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex">
        {!hideCategory && (
          <FilterSelect
            id="catalog-category"
            label="Category"
            value={filters.categoryId}
            onChange={(value) => onChange({ categoryId: value })}
            options={[{ value: 'all', label: 'All categories' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
        )}
        <FilterSelect
          id="catalog-availability"
          label="Availability"
          value={filters.availability}
          onChange={(value) => onChange({ availability: value as AvailabilityFilter })}
          options={AVAILABILITY}
        />
        <FilterSelect
          id="catalog-sort"
          label="Sort by"
          value={filters.sort}
          onChange={(value) => onChange({ sort: value as SortOption })}
          options={SORT_OPTIONS}
        />
      </div>
    </div>
  )
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="relative md:w-48">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-input bg-background pl-3 pr-9 text-sm font-medium text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  )
}
