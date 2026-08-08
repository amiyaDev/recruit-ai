const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida/AP1WRLusUdBP0fC9M-p_pfveggZ8O2uPIlnKUHejtnsT8RxoVDMc1yfNJQwcty5AUpTetzl2AXjS5UONEEv-kcwwH7DMMc2ONSo5gTS9exIc2RIGNc7YSedeRQjjqw7vfStZeH9xmRdxepqI8zXHYmI1SJ2iRKjh-U65-ufsjKaLwHRgyRvmAHPLoE4SKVhfYNb4SluXpTUjO3_0CYX5xBzC1U0rh2l_M2KH2OhFw17kHcBJYtcJY53yWIXRq9k";

export function BrandLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img
      className={`object-contain rounded-md ${className}`}
      alt="RecruitAI logo — abstract R with AI spark, indigo to teal gradient, vector style"
      src={LOGO_SRC}
    />
  );
}
