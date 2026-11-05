import { HeroSection } from '@/components/home/hero-section'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { HowToOrder } from '@/components/home/how-to-order'
import { ContactCta } from '@/components/home/contact-cta'
import { AgricultureShowcase } from '@/components/home/agriculture-showcase'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <AgricultureShowcase />
      <FeaturedProducts />
      <WhyChooseUs />
      <HowToOrder />
      <ContactCta />
    </>
  )
}
