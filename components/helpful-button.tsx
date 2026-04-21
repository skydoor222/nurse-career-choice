"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function HelpfulButton({ reviewId }: { reviewId: string }) {
  const [clicked, setClicked] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (clicked) return;
        setClicked(true);
        try {
          const key = `helpful:${reviewId}`;
          localStorage.setItem(key, "1");
        } catch {}
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition",
        clicked
          ? "border-coral-500 bg-coral-100 text-coral-500"
          : "border-black/10 bg-white text-ink-muted hover:bg-black/5"
      )}
    >
      <ThumbsUp className="h-3.5 w-3.5" />
      参考になった{clicked ? " ✓" : ""}
    </button>
  );
}
