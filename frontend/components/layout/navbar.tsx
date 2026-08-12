"use client"
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter()
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <a href="#" className="flex items-center">
          <BrandLogo className="h-20 w-auto transition-transform duration-200 group-hover:scale-105" />
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
            className="shadcn-btn-outline hidden md:block font-body-md text-muted-foreground hover:text-foreground px-3 py-2 transition-colors duration-200"
            onClick={()=>router.push('/login')}
          >
            Log in
          </button>
          <button type="button" className="shadcn-btn-primary font-body-md px-6 py-2"
            onClick={()=>router.push('/login')}
          
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
