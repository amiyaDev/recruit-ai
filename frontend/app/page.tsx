import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustedBySection } from "@/components/landing/trusted-by-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";

export default function Home() {
  return (
    <div className="relative selection:bg-primary-container selection:text-white">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-50 -z-10 pointer-events-none" />
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <Navbar />

      <main className="pt-32 pb-section-gap px-6 md:px-8 max-w-7xl mx-auto space-y-24">
        <HeroSection />
        <TrustedBySection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
