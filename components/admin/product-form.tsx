'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { Product } from '@/types'
import { useAdminCatalog } from '@/contexts/admin-catalog-context'
import { SLUG_PATTERN, createId, isImageSource, slugify } from '@/lib/admin-utils'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { FormField, FormSection, SelectChevron, nativeSelectClass } from '@/components/admin/form-field'
import { ProductImage } from '@/components/products/product-image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const baseSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.'),
  slug: z.string().trim().regex(SLUG_PATTERN, 'Use lowercase letters, numbers, and hyphens only.'),
  brand: z.string().trim().min(1, 'Brand is required.'),
  categoryId: z.string().min(1, 'Choose a category.'),
  shortDescription: z.string().trim().min(10, 'Add a short summary (at least 10 characters).').max(200, 'Keep it under 200 characters.'),
  description: z.string().trim().min(20, 'Add a fuller description (at least 20 characters).'),
  activeIngredient: z.string().trim().optional(),
  formulation: z.string().trim().optional(),
  manufacturer: z.string().trim().optional(),
  packSize: z.string().trim().min(1, 'Pack size is required.'),
  price: z.number({ error: 'Enter a price.' }).positive('Price must be greater than zero.'),
  stock: z.number({ error: 'Enter stock quantity.' }).int('Stock must be a whole number.').min(0, 'Stock cannot be negative.'),
  sku: z.string().trim().optional(),
  mainImage: z.string().trim().min(1, 'The first product image is required.'),
  extraImages: z.string(),
  video: z.union([z.literal(''), z.url('Enter a valid video URL.')]),
  usageInfo: z.string().trim().min(10, 'Usage information is required.'),
  safetyInfo: z.string().trim().optional(),
  storageInfo: z.string().trim().optional(),
  featured: z.boolean(),
  status: z.enum(['draft', 'published']),
})

type ProductValues = z.infer<typeof baseSchema>

function toValues(product?: Product): ProductValues {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    brand: product?.brand ?? '',
    categoryId: product?.categoryId ?? '',
    shortDescription: product?.shortDescription ?? '',
    description: product?.description ?? '',
    activeIngredient: product?.activeIngredient ?? '',
    formulation: product?.formulation ?? '',
    manufacturer: product?.manufacturer ?? '',
    packSize: product?.packSize ?? '',
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    sku: product?.sku ?? '',
    mainImage: product?.images[0] ?? '',
    extraImages: product?.images.slice(1).join('\n') ?? '',
    video: product?.video ?? '',
    usageInfo: product?.usageInfo ?? '',
    safetyInfo: product?.safetyInfo ?? '',
    storageInfo: product?.storageInfo ?? '',
    featured: product?.featured ?? false,
    status: product?.status ?? 'draft',
  }
}

const emptyToUndefined = (value?: string) => (value && value.trim() ? value.trim() : undefined)

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const { products, categories, saveProduct, uploadMedia } = useAdminCatalog()
  const [slugTouched, setSlugTouched] = useState(!!product)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const schema = useMemo(
    () =>
      baseSchema.superRefine((values, ctx) => {
        if (products.some((p) => p.slug === values.slug && p.id !== product?.id)) {
          ctx.addIssue({ code: 'custom', path: ['slug'], message: 'Another product already uses this slug.' })
        }
        const images = [values.mainImage, ...values.extraImages.split('\n')].map((s) => s.trim()).filter(Boolean)
        if (images.length > 12) {
          ctx.addIssue({ code: 'custom', path: ['extraImages'], message: 'A product can have up to 12 images.' })
        }
        if (images.some((src) => !isImageSource(src))) {
          ctx.addIssue({ code: 'custom', path: ['extraImages'], message: 'Images must be /local paths or http(s) URLs.' })
        }
        if (values.status === 'published') {
          const category = categories.find((c) => c.id === values.categoryId)
          if (category && !category.isActive) {
            ctx.addIssue({ code: 'custom', path: ['categoryId'], message: 'This category is inactive. Activate it or save as draft.' })
          }
        }
      }),
    [products, categories, product?.id],
  )

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductValues>({ resolver: zodResolver(schema), defaultValues: toValues(product) })

  const mainImage = useWatch({ control, name: 'mainImage' })
  const extraImages = useWatch({ control, name: 'extraImages' })
  const video = useWatch({ control, name: 'video' })
  const featured = useWatch({ control, name: 'featured' })
  const status = useWatch({ control, name: 'status' })
  const nameField = register('name')

  const onSubmit = async (values: ProductValues) => {
    const now = new Date().toISOString()
    const images = [values.mainImage, ...values.extraImages.split('\n')].map((s) => s.trim()).filter(Boolean)
    try {
      await saveProduct({
        id: product?.id ?? createId('prod'),
        name: values.name.trim(),
        slug: values.slug,
        brand: values.brand.trim(),
        categoryId: values.categoryId,
        shortDescription: values.shortDescription.trim(),
        description: values.description.trim(),
        activeIngredient: emptyToUndefined(values.activeIngredient),
        formulation: emptyToUndefined(values.formulation),
        manufacturer: emptyToUndefined(values.manufacturer),
        packSize: values.packSize.trim(),
        price: values.price,
        stock: values.stock,
        sku: emptyToUndefined(values.sku),
        images,
        video: values.video,
        usageInfo: values.usageInfo.trim(),
        safetyInfo: emptyToUndefined(values.safetyInfo),
        storageInfo: emptyToUndefined(values.storageInfo),
        featured: values.featured,
        status: values.status,
        createdAt: product?.createdAt ?? now,
        updatedAt: now,
      })
      toast.success(product ? 'Product updated' : 'Product created')
      router.push('/admin/products')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save product.')
    }
  }

  const uploadProductImages = async (files: FileList | null) => {
    if (!files?.length) return
    const selected = Array.from(files)
    const existing = [mainImage, ...extraImages.split('\n')].map((image) => image.trim()).filter(Boolean)
    if (existing.length + selected.length > 12) {
      toast.error('A product can have up to 12 images.')
      return
    }

    setUploadingImage(true)
    try {
      const urls = await Promise.all(selected.map((file) => uploadMedia(file, 'products')))
      const next = [...existing, ...urls]
      setValue('mainImage', next[0] ?? '', { shouldValidate: true, shouldDirty: true })
      setValue('extraImages', next.slice(1).join('\n'), { shouldValidate: true, shouldDirty: true })
      toast.success(`${urls.length} product ${urls.length === 1 ? 'image' : 'images'} uploaded`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to upload product images.')
    } finally {
      setUploadingImage(false)
    }
  }

  const uploadProductVideo = async (file?: File) => {
    if (!file) return
    setUploadingVideo(true)
    try {
      const url = await uploadMedia(file, 'products', 'video')
      setValue('video', url, { shouldValidate: true, shouldDirty: true })
      toast.success('Product video uploaded')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to upload product video.')
    } finally {
      setUploadingVideo(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Link href="/admin/products" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Products
      </Link>
      <AdminPageHeader
        title={product ? 'Edit product' : 'Add product'}
        description={product ? `Editing ${product.name}` : 'Create a new product for your catalogue.'}
      />

      <FormSection title="Basic details">
        <FormField id="name" label="Product name" error={errors.name?.message} className="sm:col-span-2">
          <Input
            id="name"
            aria-invalid={!!errors.name}
            {...nameField}
            onChange={(e) => {
              nameField.onChange(e)
              if (!slugTouched) setValue('slug', slugify(e.target.value), { shouldValidate: false })
            }}
          />
        </FormField>
        <FormField id="slug" label="URL slug" error={errors.slug?.message} hint="Used in the product page address.">
          <Input id="slug" aria-invalid={!!errors.slug} {...register('slug', { onChange: () => setSlugTouched(true) })} />
        </FormField>
        <FormField id="brand" label="Brand" error={errors.brand?.message}>
          <Input id="brand" aria-invalid={!!errors.brand} {...register('brand')} />
        </FormField>
        <FormField id="categoryId" label="Category" error={errors.categoryId?.message}>
          <div className="relative">
            <select id="categoryId" aria-invalid={!!errors.categoryId} className={nativeSelectClass} {...register('categoryId')}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.isActive ? '' : ' (inactive)'}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </FormField>
        <FormField id="manufacturer" label="Manufacturer" optional>
          <Input id="manufacturer" {...register('manufacturer')} />
        </FormField>
        <FormField id="shortDescription" label="Short description" error={errors.shortDescription?.message} className="sm:col-span-2">
          <Textarea id="shortDescription" rows={2} aria-invalid={!!errors.shortDescription} {...register('shortDescription')} />
        </FormField>
        <FormField id="description" label="Full description" error={errors.description?.message} className="sm:col-span-2">
          <Textarea id="description" rows={5} aria-invalid={!!errors.description} {...register('description')} />
        </FormField>
      </FormSection>

      <FormSection title="Technical details">
        <FormField id="activeIngredient" label="Active ingredient" optional>
          <Input id="activeIngredient" {...register('activeIngredient')} />
        </FormField>
        <FormField id="formulation" label="Formulation" optional hint="e.g. EC, SL, WP, granules">
          <Input id="formulation" {...register('formulation')} />
        </FormField>
      </FormSection>

      <FormSection title="Pricing & inventory">
        <FormField id="price" label="Price (₦)" error={errors.price?.message}>
          <Input id="price" type="number" inputMode="decimal" min={0} step="any" aria-invalid={!!errors.price} {...register('price', { valueAsNumber: true })} />
        </FormField>
        <FormField id="packSize" label="Pack size" error={errors.packSize?.message} hint="e.g. 1 Litre, 50 kg bag">
          <Input id="packSize" aria-invalid={!!errors.packSize} {...register('packSize')} />
        </FormField>
        <FormField id="stock" label="Stock quantity" error={errors.stock?.message}>
          <Input id="stock" type="number" inputMode="numeric" min={0} step={1} aria-invalid={!!errors.stock} {...register('stock', { valueAsNumber: true })} />
        </FormField>
        <FormField id="sku" label="SKU" optional>
          <Input id="sku" {...register('sku')} />
        </FormField>
      </FormSection>

      <FormSection title="Images" description="The first image is the required cover. Upload several images at once or enter image URLs.">
        <FormField id="mainImage" label="Main image" error={errors.mainImage?.message} className="sm:col-span-2">
          <div className="flex gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
              <ProductImage src={isImageSource(mainImage) ? mainImage : undefined} alt="Main image preview" sizes="80px" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Input id="mainImage" aria-invalid={!!errors.mainImage} placeholder="/images/products/... or https://..." {...register('mainImage')} />
              <Input
                id="productImagesUpload"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={uploadingImage}
                aria-label="Upload product images"
                onChange={(event) => {
                  void uploadProductImages(event.target.files)
                  event.target.value = ''
                }}
              />
              <p className="text-xs text-muted-foreground">Choose multiple JPEG, PNG, WebP or AVIF files (max 4 MB each, 12 images total).</p>
            </div>
          </div>
        </FormField>
        <FormField id="extraImages" label="Additional images" optional error={errors.extraImages?.message} hint="One path or URL per line." className="sm:col-span-2">
          <Textarea id="extraImages" rows={3} aria-invalid={!!errors.extraImages} {...register('extraImages')} />
        </FormField>
      </FormSection>

      <FormSection title="Product video" description="Optional. Upload an MP4, WebM, or MOV file up to 50 MB, or paste a video URL.">
        <FormField id="video" label="Video URL" optional error={errors.video?.message} className="sm:col-span-2">
          <div className="flex flex-col gap-3">
            <Input id="video" type="url" aria-invalid={!!errors.video} placeholder="https://..." {...register('video')} />
            <Input
              id="videoUpload"
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              disabled={uploadingVideo}
              aria-label="Upload product video"
              onChange={(event) => {
                void uploadProductVideo(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            {video && (
              <video src={video} controls preload="metadata" className="max-h-64 w-full rounded-lg bg-black" aria-label={`${product?.name ?? 'Product'} video preview`} />
            )}
          </div>
        </FormField>
      </FormSection>

      <FormSection title="Usage, safety & storage">
        <FormField id="usageInfo" label="Usage information" error={errors.usageInfo?.message} className="sm:col-span-2">
          <Textarea id="usageInfo" rows={4} aria-invalid={!!errors.usageInfo} {...register('usageInfo')} />
        </FormField>
        <FormField id="safetyInfo" label="Safety information" optional className="sm:col-span-2">
          <Textarea id="safetyInfo" rows={3} {...register('safetyInfo')} />
        </FormField>
        <FormField id="storageInfo" label="Storage information" optional className="sm:col-span-2">
          <Textarea id="storageInfo" rows={2} {...register('storageInfo')} />
        </FormField>
      </FormSection>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-lg font-bold">Visibility</h2>
        <ToggleRow
          id="status"
          label="Published"
          description="Published products appear on the storefront. Drafts stay hidden."
          checked={status === 'published'}
          onChange={(v) => setValue('status', v ? 'published' : 'draft', { shouldDirty: true })}
        />
        <ToggleRow
          id="featured"
          label="Featured on homepage"
          description="Highlight this product in the featured section."
          checked={featured}
          onChange={(v) => setValue('featured', v, { shouldDirty: true })}
        />
        {(errors.mainImage || errors.categoryId) && status === 'published' && (
          <p className="text-xs text-destructive">Fix the highlighted fields above, or save as draft.</p>
        )}
      </section>

      <div className="sticky bottom-0 -mx-4 flex justify-end gap-3 border-t border-border bg-muted/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <Link href="/admin/products" className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:bg-secondary">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage || uploadingVideo}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {product ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  )
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={(v) => onChange(!!v)} />
    </div>
  )
}
