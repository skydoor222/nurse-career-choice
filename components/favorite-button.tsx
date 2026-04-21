"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/app/actions";

export function FavoriteButton({
  wardId,
  initial,
  loggedIn,
}: {
  wardId: string;
  initial: boolean;
  loggedIn: boolean;
}) {
  const [fav, setFav] = useState(initial);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!loggedIn) {
          location.href = "/login";
          return;
        }
        const next = !fav;
        setFav(next);
        startTransition(async () => {
          await toggleFavorite(wardId, next);
        });
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition",
        fav
          ? "border-coral-500 bg-coral-500 text-white"
          : "border-hairline bg-white text-ink hover:bg-ink/5"
      )}
    >
      <Heart className={cn("h-4 w-4", fav && "fill-white")} />
      {fav ? "お気に入り登録中" : "お気に入りに追加"}
    </button>
  );
}
