import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { DataChartsSection } from "@/components/data-charts-section"
import { AboutSection } from "@/components/about-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { FAQSection } from "@/components/faq-section"
import { ContactForm } from "@/components/contact-form"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { FloatingDemoButton } from "@/components/floating-demo-button"
import { CookieConsent } from "@/components/cookie-consent"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <section aria-label="Platform features">
        <FeaturesSection />
      </section>
      <section aria-label="Performance data and charts">
        <DataChartsSection />
      </section>
      <section aria-label="About AirSight AI">
        <AboutSection />
      </section>
      <section aria-label="Customer testimonials and social proof">
        <SocialProofSection />
      </section>
      <section aria-label="Frequently asked questions">
        <FAQSection />
      </section>
      <section aria-label="Contact information and form">
        <ContactForm />
      </section>
      <section aria-label="Additional testimonials">
        <TestimonialsSection />
      </section>
      <Footer />
      <FloatingDemoButton />
      <CookieConsent />
    </main>
  )
}
