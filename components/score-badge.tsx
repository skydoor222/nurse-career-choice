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
  const starSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm";
  const rounded = Math.round(score * 2) / 2;
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex">
        {Array.from({ length: outOf }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled
                  ? "fill-amber-400 text-amber-400"
                  : half
                  ? "fill-amber-200 text-amber-400"
                  : "fill-gray-200 text-gray-300"
              )}
            />
          );
        })}
      </span>
      {showNumber && (
        <span className={cn("font-bold tabular-nums", textSize)}>
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
}
