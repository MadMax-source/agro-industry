'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li'
}

/** Fades and lifts content into view once, as it scrolls on screen. */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div' }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Component>
  )
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

interface StaggerProps {
  children: ReactNode
  className?: string
  as?: 'ul' | 'ol' | 'div'
}

/** Parent for staggered children; pair with `<motion.li variants={staggerItem}>`. */
export function Stagger({ children, className, as = 'ul' }: StaggerProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </Component>
  )
}
