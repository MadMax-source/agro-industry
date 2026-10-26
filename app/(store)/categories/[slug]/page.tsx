import type { Metadata } from 'next'
import { seedCategories } from '@/lib/data/seed'
import { CategoryView } from '@/components/categories/category-view'

export function generateStaticParams() {
  return seedCategories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = seedCategories.find((c) => c.slug === slug)
  if (!category) return { title: 'Category' }
  return {
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? category.description,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CategoryView slug={slug} />
}
