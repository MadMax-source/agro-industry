'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  value: number
  max: number
  onChange: (value: number) => void
  labelledBy?: string
}

export function QuantityStepper({ value, max, onChange, labelledBy }: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(Math.max(1, Number.isFinite(next) ? Math.floor(next) : 1), Math.max(1, max))

  return (
    <div role="group" aria-labelledby={labelledBy} className="flex h-11 items-center rounded-lg border border-input bg-card">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 1}
        className="flex size-11 items-center justify-center text-foreground hover:text-primary disabled:text-muted-foreground/50"
      >
        <Minus className="size-4" aria-hidden="true" />
        <span className="sr-only">Decrease quantity</span>
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
        aria-label="Quantity"
        className="h-full w-14 border-x border-input bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] focus:bg-secondary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="flex size-11 items-center justify-center text-foreground hover:text-primary disabled:text-muted-foreground/50"
      >
        <Plus className="size-4" aria-hidden="true" />
        <span className="sr-only">Increase quantity</span>
      </button>
    </div>
  )
}
