'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Info, Loader2 } from 'lucide-react'
import { demoAuthProvider, useAdminAuth, type SignInResult } from '@/lib/admin-auth'
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/config'
import { BrandLogo } from '@/components/layout/brand-logo'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

type LoginValues = z.infer<typeof schema>

export function AdminLoginForm() {
  const router = useRouter()
  const setSession = useAdminAuth((s) => s.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  const finish = (result: SignInResult) => {
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    setSession(result.session)
    router.replace('/admin')
  }

  const onSubmit = async (values: LoginValues) => {
    setFormError(null)
    finish(await demoAuthProvider.signIn(values.email, values.password))
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-secondary/60 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage products, categories, and business settings.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {formError && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Sign in
            </button>
            <button
              type="button"
              onClick={async () => finish(await demoAuthProvider.enterDemo())}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Enter demo admin
            </button>
          </form>

          <div className="mt-6 flex gap-3 rounded-lg border border-earth/30 bg-earth/10 p-3 text-xs leading-relaxed text-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-earth" aria-hidden="true" />
            <p>
              Prototype access only. Demo login: <strong>{DEMO_ADMIN_EMAIL}</strong> / <strong>{DEMO_ADMIN_PASSWORD}</strong>.
              This check runs in the browser and is not real security — add server-side authentication before going live.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">
            {'← Back to storefront'}
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
