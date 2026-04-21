type ScoreRingProps = {
  score: number;
  max?: number;
  size?: number;
  color?: string;
  label?: string;
  showLabel?: boolean;
};

export function ScoreRing({
  score,
  max = 5,
  size = 52,
  color = "#ff6b6b",
  label,
  showLabel = false,
}: ScoreRingProps) {
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(max, score));
  const dash = (clamped / max) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(0,0,0,.06)"
            strokeWidth={6}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="tabular-nums font-bold" style={{ fontSize: size < 56 ? 11 : 13 }}>
            {clamped.toFixed(1)}
          </span>
        </div>
      </div>
      {showLabel && label && (
        <span className="text-center text-[10px] font-semibold text-ink-muted leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}
