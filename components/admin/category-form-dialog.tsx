'use client'

import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { Category } from '@/types'
import { useCatalogStore } from '@/store/catalog-store'
import { SLUG_PATTERN, createId, isImageSource, slugify } from '@/lib/admin-utils'
import { FormField } from '@/components/admin/form-field'
import { ProductImage } from '@/components/products/product-image'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const baseSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.'),
  slug: z.string().trim().regex(SLUG_PATTERN, 'Use lowercase letters, numbers, and hyphens only.'),
  description: z.string().trim().min(10, 'Add a description (at least 10 characters).'),
  image: z.string().trim().refine((v) => !v || isImageSource(v), 'Use a /local path or http(s) URL.'),
  displayOrder: z.number({ error: 'Enter a number.' }).int('Whole numbers only.').min(0, 'Cannot be negative.'),
  isActive: z.boolean(),
  seoTitle: z.string().trim().max(70, 'Keep under 70 characters.').optional(),
  seoDescription: z.string().trim().max(160, 'Keep under 160 characters.').optional(),
})

type CategoryValues = z.infer<typeof baseSchema>

interface CategoryFormDialogProps {
  open: boolean
  category: Category | null
  onOpenChange: (open: boolean) => void
}

export function CategoryFormDialog({ open, category, onOpenChange }: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {open && <CategoryForm key={category?.id ?? 'new'} category={category} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function CategoryForm({ category, onDone }: { category: Category | null; onDone: () => void }) {
  const categories = useCatalogStore((s) => s.categories)
  const upsertCategory = useCatalogStore((s) => s.upsertCategory)
  const [slugTouched, setSlugTouched] = useState(!!category)

  const schema = useMemo(
    () =>
      baseSchema.superRefine((values, ctx) => {
        if (categories.some((c) => c.slug === values.slug && c.id !== category?.id)) {
          ctx.addIssue({ code: 'custom', path: ['slug'], message: 'Another category already uses this slug.' })
        }
      }),
    [categories, category?.id],
  )

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      description: category?.description ?? '',
      image: category?.image ?? '',
      displayOrder: category?.displayOrder ?? categories.length + 1,
      isActive: category?.isActive ?? true,
      seoTitle: category?.seoTitle ?? '',
      seoDescription: category?.seoDescription ?? '',
    },
  })

  const image = useWatch({ control, name: 'image' })
  const isActive = useWatch({ control, name: 'isActive' })
  const nameField = register('name')

  const onSubmit = (values: CategoryValues) => {
    const now = new Date().toISOString()
    upsertCategory({
      id: category?.id ?? createId('cat'),
      name: values.name.trim(),
      slug: values.slug,
      description: values.description.trim(),
      image: values.image,
      displayOrder: values.displayOrder,
      isActive: values.isActive,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      createdAt: category?.createdAt ?? now,
      updatedAt: now,
    })
    toast.success(category ? 'Category updated' : 'Category created')
    onDone()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{category ? 'Edit category' : 'New category'}</DialogTitle>
        <DialogDescription>Categories group products on the storefront.</DialogDescription>
      </DialogHeader>

      <FormField id="cat-name" label="Name" error={errors.name?.message}>
        <Input
          id="cat-name"
          aria-invalid={!!errors.name}
          {...nameField}
          onChange={(e) => {
            nameField.onChange(e)
            if (!slugTouched) setValue('slug', slugify(e.target.value))
          }}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="cat-slug" label="Slug" error={errors.slug?.message}>
          <Input id="cat-slug" aria-invalid={!!errors.slug} {...register('slug', { onChange: () => setSlugTouched(true) })} />
        </FormField>
        <FormField id="cat-order" label="Display order" error={errors.displayOrder?.message}>
          <Input id="cat-order" type="number" min={0} step={1} aria-invalid={!!errors.displayOrder} {...register('displayOrder', { valueAsNumber: true })} />
        </FormField>
      </div>
      <FormField id="cat-description" label="Description" error={errors.description?.message}>
        <Textarea id="cat-description" rows={3} aria-invalid={!!errors.description} {...register('description')} />
      </FormField>
      <FormField id="cat-image" label="Image" optional error={errors.image?.message}>
        <div className="flex gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
            <ProductImage src={isImageSource(image) ? image : undefined} alt="Category image preview" sizes="56px" />
          </div>
          <Input id="cat-image" aria-invalid={!!errors.image} placeholder="/images/categories/..." {...register('image')} />
        </div>
      </FormField>
      <FormField id="cat-seo-title" label="SEO title" optional error={errors.seoTitle?.message}>
        <Input id="cat-seo-title" {...register('seoTitle')} />
      </FormField>
      <FormField id="cat-seo-desc" label="SEO description" optional error={errors.seoDescription?.message}>
        <Textarea id="cat-seo-desc" rows={2} {...register('seoDescription')} />
      </FormField>
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <label htmlFor="cat-active" className="text-sm font-medium">
          Active on storefront
        </label>
        <Switch id="cat-active" checked={isActive} onCheckedChange={(v) => setValue('isActive', !!v)} />
      </div>

      <DialogFooter>
        <button type="button" onClick={onDone} className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold hover:bg-secondary">
          Cancel
        </button>
        <button type="submit" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          {category ? 'Save changes' : 'Create category'}
        </button>
      </DialogFooter>
    </form>
  )
}
