import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { FOOTER_LINKS } from "@/constants/landing-content";

export function Footer() {
  return (
    <ScrollReveal
      as="footer"
      className="w-full py-16 bg-surface-container-lowest dark:bg-[#070a11] border-t border-outline-variant/30 dark:border-white/10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1 space-y-6">
          <a className="flex items-center gap-2 group" href="#">
            <img
              alt="RecruitAI logo"
              className="w-8 h-8 object-contain rounded-md"
              src="https://lh3.googleusercontent.com/aida/AP1WRLusUdBP0fC9M-p_pfveggZ8O2uPIlnKUHejtnsT8RxoVDMc1yfNJQwcty5AUpTetzl2AXjS5UONEEv-kcwwH7DMMc2ONSo5gTS9exIc2RIGNc7YSedeRQjjqw7vfStZeH9xmRdxepqI8zXHYmI1SJ2iRKjh-U65-ufsjKaLwHRgyRvmAHPLoE4SKVhfYNb4SluXpTUjO3_0CYX5xBzC1U0rh2l_M2KH2OhFw17kHcBJYtcJY53yWIXRq9k"
            />
            <span className="font-headline-md text-lg font-bold text-foreground">RecruitAI</span>
          </a>
          <p className="font-body-md text-sm text-muted-foreground max-w-xs leading-relaxed">
            Empowering careers through intelligence.
          </p>
          <p className="font-body-md text-xs text-outline mt-4">
            &copy; {new Date().getFullYear()} RecruitAI.
          </p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className="space-y-4">
            <h4 className="font-headline-md text-base font-semibold text-primary dark:text-primary-fixed">
              {heading}
            </h4>
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-body-md text-sm text-muted-foreground hover:text-primary dark:hover:text-white hover:translate-x-1 transition-all duration-200 w-fit"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
