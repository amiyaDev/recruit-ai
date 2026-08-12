export function AuthVisualPanel({type}:{type:'login'| 'signup'}) {
  return (
    <div className="hidden md:flex w-1/2 relative bg-surface-container overflow-hidden items-center justify-center p-stack-lg">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-tertiary-container opacity-80 mix-blend-multiply" />

      {/* Floating Glassmorphic Blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary-container/30 rounded-full mix-blend-screen filter blur-[40px] blob-1" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tertiary-fixed/20 rounded-full mix-blend-screen filter blur-[60px] blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[80px] blob-3" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        <div className="text-center mb-stack-lg glass-panel p-stack-md rounded-xl inline-block fade-in-up">
          <h2 className="font-display-lg text-display-lg gradient-text mb-2">
            Your dream career
            <br />
            is just a login away.
          </h2>
          <p className="font-body-lg text-body-lg text-surface-variant font-medium">
            Harness the power of AI to optimize your professional path.
          </p>
        </div>

        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl glass-panel border border-outline/20 fade-in-up delay-200 group">
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent z-10" />
          <img
            alt="RecruitAI Hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={type === 'login'? "/images/login_hero.png": "/images/signup_hero.png"}
          />
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-on-surface/60 backdrop-blur-md py-2 px-4 rounded-full border border-white/10">
            <div className="w-3 h-3 rounded-full bg-tertiary-fixed animate-pulse" />
            <span className="font-label-sm text-label-sm text-surface tracking-wider">
              AI SYSTEM ONLINE
            </span>
          </div>
        </div>

        {/* Ambient Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>
    </div>
  );
}
