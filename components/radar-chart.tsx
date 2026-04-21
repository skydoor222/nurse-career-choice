"use client";

type Axis = { label: string; value: number };

export function RadarChart({
  axes,
  size = 280,
}: {
  axes: Axis[]; // 0-5 scale
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 40;
  const n = axes.length;

  const pointFor = (value: number, i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (Math.max(0, Math.min(5, value)) / 5) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  };

  const labelPos = (i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = radius + 18;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  };

  const gridPoints = (v: number) =>
    axes
      .map((_, i) => {
        const [x, y] = pointFor(v, i);
        return `${x},${y}`;
      })
      .join(" ");

  const dataPath = axes
    .map((a, i) => {
      const [x, y] = pointFor(a.value, i);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .concat("Z")
    .join(" ");

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="auto"
        style={{ maxWidth: size }}
        role="img"
        aria-label="病棟評価レーダーチャート"
      >
        {[1, 2, 3, 4, 5].map((v) => (
          <polygon
            key={v}
            points={gridPoints(v)}
            fill="none"
            stroke="rgba(15,21,53,0.08)"
            strokeWidth={1}
          />
        ))}

        {axes.map((_, i) => {
          const [x, y] = pointFor(5, i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(15,21,53,0.08)"
              strokeWidth={1}
            />
          );
        })}

        <path
          d={dataPath}
          fill="rgba(255, 45, 120, 0.18)"
          stroke="#FF2D78"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {axes.map((a, i) => {
          const [x, y] = pointFor(a.value, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3.5}
              fill="#FF2D78"
              stroke="white"
              strokeWidth={2}
            />
          );
        })}

        {axes.map((a, i) => {
          const [lx, ly] = labelPos(i);
          return (
            <g key={i}>
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="700"
                fill="#0F1535"
              >
                {a.label}
              </text>
              <text
                x={lx}
                y={ly + 13}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="rgba(15,21,53,0.55)"
              >
                {a.value.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
