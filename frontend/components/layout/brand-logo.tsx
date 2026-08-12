const LOGO_SRC_LIGHT = "/images/recruit_ai_logo_light.png";
const LOGO_SRC_DARK = "/images/recruit_ai_logo.png";

export function BrandLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <>
      <img
        className={`object-contain rounded-md dark:hidden ${className}`}
        alt="RecruitAI logo — abstract R with AI spark, indigo to teal gradient, vector style"
        src={LOGO_SRC_LIGHT}
      />
      <img
        className={`object-contain rounded-md hidden dark:block ${className}`}
        alt="RecruitAI logo — abstract R with AI spark, indigo to teal gradient, vector style"
        src={LOGO_SRC_DARK}
      />
    </>
  );
}
