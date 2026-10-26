import type { Metadata } from 'next'
import { seedProducts } from '@/lib/data/seed'
import { ProductDetail } from '@/components/products/product-detail'

export function generateStaticParams() {
  return seedProducts.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = seedProducts.find((p) => p.slug === slug)
  if (!product) return { title: 'Product' }
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription, images: product.images.slice(0, 1) },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProductDetail slug={slug} />
}
