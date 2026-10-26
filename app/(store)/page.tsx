import { HeroSection } from '@/components/home/hero-section'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { HowToOrder } from '@/components/home/how-to-order'
import { ContactCta } from '@/components/home/contact-cta'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyChooseUs />
      <HowToOrder />
      <ContactCta />
    </>
  )
}
