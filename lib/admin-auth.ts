'use client'

import { create } from 'zustand'
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/config'

/**
 * FRONTEND PROTOTYPE AUTH — NOT SECURE.
 * There is no backend, so anyone can bypass this check with browser dev tools.
 * Only a session flag and the email are kept (in sessionStorage); passwords are
 * never stored. Swap `demoAuthProvider` for a server-backed provider later —
 * the rest of the admin only depends on the `AdminAuthProvider` interface.
 */
export interface AdminSession {
  email: string
  signedInAt: string
}

export type SignInResult = { ok: true; session: AdminSession } | { ok: false; error: string }

export interface AdminAuthProvider {
  signIn: (email: string, password: string) => Promise<SignInResult>
  enterDemo: () => Promise<SignInResult>
  signOut: () => Promise<void>
  getSession: () => AdminSession | null
}

const SESSION_KEY = 'funalom-admin-session'

function saveSession(email: string): AdminSession {
  const session = { email, signedInAt: new Date().toISOString() }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export const demoAuthProvider: AdminAuthProvider = {
  async signIn(email, password) {
    if (email.trim().toLowerCase() !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
      return { ok: false, error: 'Incorrect email or password.' }
    }
    return { ok: true, session: saveSession(DEMO_ADMIN_EMAIL) }
  },
  async enterDemo() {
    return { ok: true, session: saveSession(DEMO_ADMIN_EMAIL) }
  },
  async signOut() {
    sessionStorage.removeItem(SESSION_KEY)
  },
  getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      const parsed = raw ? (JSON.parse(raw) as AdminSession) : null
      return parsed && typeof parsed.email === 'string' ? parsed : null
    } catch {
      return null
    }
  },
}

interface AdminAuthState {
  status: 'loading' | 'authenticated' | 'anonymous'
  session: AdminSession | null
  load: () => void
  setSession: (session: AdminSession | null) => void
}

export const useAdminAuth = create<AdminAuthState>()((set) => ({
  status: 'loading',
  session: null,
  load: () => {
    const session = demoAuthProvider.getSession()
    set({ session, status: session ? 'authenticated' : 'anonymous' })
  },
  setSession: (session) => set({ session, status: session ? 'authenticated' : 'anonymous' }),
}))
