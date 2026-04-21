export function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
          {label}
        </span>
        <span className="tabular-nums text-[11px] font-bold" style={{ color }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${(score / 5) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function OvertimeBar({ hours }: { hours: number }) {
  const color =
    hours <= 10 ? "#2d7a4f" : hours <= 20 ? "#b86800" : "#d63030";
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-[10px] font-semibold text-ink-soft">月平均残業</span>
        <span className="tabular-nums text-[11px] font-bold" style={{ color }}>
          {Math.round(hours)}時間
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min((hours / 40) * 100, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}
