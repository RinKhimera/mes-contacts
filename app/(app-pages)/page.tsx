import { CategoryGrid } from "./_components/category-grid"
import { CTASection } from "./_components/cta-section"
import { FeaturesSection } from "./_components/features-section"
import { Hero } from "./_components/hero"

export default async function Home() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}
