import type { Testimonial } from "@/types/landing.types";

export function TestimonialCard({ initials, name, role, quote, avatarClassName }: Testimonial) {
  return (
    <div className="shadcn-card p-6 space-y-4 flex flex-col">
      <div className="flex text-tertiary dark:text-tertiary-fixed mb-2 gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
      </div>
      <p className="font-body-md text-muted-foreground italic flex-grow">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20 dark:border-white/10">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${avatarClassName}`}
        >
          {initials}
        </div>
        <div>
          <p className="font-label-sm text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}
