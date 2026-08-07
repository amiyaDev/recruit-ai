import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <a className="flex items-center gap-2 group" href="#">
          <img
            className="w-10 h-10 object-contain rounded-md transition-transform duration-200 group-hover:scale-105"
            alt="RecruitAI logo abstract R with AI spark indigo to teal gradient vector style clean lines"
            src="https://lh3.googleusercontent.com/aida/AP1WRLusUdBP0fC9M-p_pfveggZ8O2uPIlnKUHejtnsT8RxoVDMc1yfNJQwcty5AUpTetzl2AXjS5UONEEv-kcwwH7DMMc2ONSo5gTS9exIc2RIGNc7YSedeRQjjqw7vfStZeH9xmRdxepqI8zXHYmI1SJ2iRKjh-U65-ufsjKaLwHRgyRvmAHPLoE4SKVhfYNb4SluXpTUjO3_0CYX5xBzC1U0rh2l_M2KH2OhFw17kHcBJYtcJY53yWIXRq9k"
          />
          <span className="font-headline-md text-xl font-bold text-foreground tracking-tight">
            RecruitAI
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            className="text-muted-foreground hover:text-primary dark:hover:text-white font-body-md transition-colors duration-200"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-muted-foreground hover:text-primary dark:hover:text-white font-body-md transition-colors duration-200"
            href="#how-it-works"
          >
            How it works
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            type="button"
            className="hidden md:block font-body-md text-muted-foreground hover:text-foreground px-3 py-2 transition-colors duration-200"
          >
            Log in
          </button>
          <button type="button" className="shadcn-btn-primary font-body-md px-6 py-2">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
