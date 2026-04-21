import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  score: number;
  outOf?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export function ScoreBadge({
  score,
  outOf = 5,
  size = "md",
  showNumber = true,
  className,
}: Props) {
  const starSize =
    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";
  const textSize =
    size === "sm" ? "text-[13px]" : size === "lg" ? "text-lg" : "text-sm";
  const rounded = Math.round(score * 2) / 2;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="flex gap-0.5">
        {Array.from({ length: outOf }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <Star
              key={i}
              strokeWidth={1.5}
              className={cn(
                starSize,
                filled
                  ? "fill-coral-500 text-coral-500"
                  : half
                  ? "fill-coral-200 text-coral-400"
                  : "fill-hairline text-hairline"
              )}
            />
          );
        })}
      </span>
      {showNumber && (
        <span className={cn("font-medium tabular-nums", textSize)}>
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
}
