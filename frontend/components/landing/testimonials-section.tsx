import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { TestimonialCard } from "@/components/landing/testimonial-card";
import { TESTIMONIALS } from "@/constants/landing-content";

export function TestimonialsSection() {
  return (
    <ScrollReveal className="space-y-12 pt-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="font-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Success Stories
        </h2>
        <p className="font-body-md text-muted-foreground text-lg">
          Hear from professionals who leveled up with RecruitAI.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </ScrollReveal>
  );
}
