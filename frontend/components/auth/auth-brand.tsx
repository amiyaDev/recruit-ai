import { BrandLogo } from "@/components/layout/brand-logo";

export function AuthBrand() {
  return (
    <div className="mb-stack-lg flex items-center gap-2">
      <BrandLogo className="w-8 h-8" />
      <span className="font-display-lg text-headline-md font-extrabold text-primary-fixed tracking-tight">
        RecruitAI
      </span>
    </div>
  );
}
