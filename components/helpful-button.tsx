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
          ? "border-brand-pink bg-brand-pink/10 text-brand-pink"
          : "border-black/10 bg-white text-brand-navy/70 hover:bg-black/5"
      )}
    >
      <ThumbsUp className="h-3.5 w-3.5" />
      参考になった{clicked ? " ✓" : ""}
    </button>
  );
}
