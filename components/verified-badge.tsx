import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({
  type = "staff",
  size = "sm",
  className,
}: {
  type?: "staff" | "alumni";
  size?: "sm" | "md";
  className?: string;
}) {
  const label = type === "staff" ? "現職Verified" : "元職員Verified";
  return (
    <span
      title="職員証やシフト表の提出で在籍確認済みのアカウントです"
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        type === "staff"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-blue-50 text-blue-700",
        className
      )}
    >
      <BadgeCheck className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {label}
    </span>
  );
}
