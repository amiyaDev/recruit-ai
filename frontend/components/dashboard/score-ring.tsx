const RING_PATH =
  "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831";

export function ScoreRing({
  score,
  size = 200,
  label,
  gradientId = "score-ring-gradient",
}: {
  score: number;
  size?: number;
  label?: string;
  gradientId?: string;
}) {
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3525cd" />
            <stop offset="100%" stopColor="#4fdbc8" />
          </linearGradient>
        </defs>
        <path d={RING_PATH} fill="none" stroke="currentColor" strokeWidth="2.8" className="text-border" />
        <path
          d={RING_PATH}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeDasharray={`${score}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display-lg text-3xl md:text-4xl font-extrabold text-foreground leading-none">
          {score}
        </span>
        {label && (
          <span className="font-label-sm text-[10px] text-muted-foreground uppercase tracking-widest mt-1.5 text-center px-2">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
