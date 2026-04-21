import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, CheckCircle2, XCircle, MessageSquarePlus } from "lucide-react";
import { createServer } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  // 応募ステータスを通知風に表示
  const { data: bookings } = await sb
    .from("bookings")
    .select(
      "*, internship:internships(*, ward:wards(*, hospital:hospitals(*)))"
    )
    .eq("user_id", user.id)
    .in("status", ["approved", "rejected"])
    .order("created_at", { ascending: false })
    .limit(20);

  // お気に入り病棟の新着レビュー
  const { data: favs } = await sb
    .from("favorites")
    .select("ward_id")
    .eq("user_id", user.id);
  const wardIds = (favs ?? []).map((f: any) => f.ward_id);
  const { data: newReviews } =
    wardIds.length > 0
      ? await sb
          .from("reviews")
          .select("*, ward:wards(*, hospital:hospitals(*))")
          .in("ward_id", wardIds)
          .order("created_at", { ascending: false })
          .limit(10)
      : { data: [] as any[] };

  const items: any[] = [
    ...(bookings ?? []).map((b: any) => ({
      kind: b.status === "approved" ? "approved" : "rejected",
      at: b.created_at,
      title:
        b.status === "approved"
          ? "インターンが承認されました"
          : "インターンが不承認となりました",
      subtitle: `${b.internship?.ward?.hospital?.name} · ${b.internship?.ward?.name}`,
      href: `/internships/${b.internship_id}`,
    })),
    ...(newReviews ?? []).map((r: any) => ({
      kind: "new_review",
      at: r.created_at,
      title: "お気に入り病棟に新しいレビュー",
      subtitle: `${r.ward?.hospital?.name} · ${r.ward?.name}`,
      href: `/wards/${r.ward_id}`,
    })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <div>
      <header className="mb-6 flex items-center gap-2">
        <Bell className="h-5 w-5 text-brand-pink" />
        <h1 className="text-2xl font-black">通知</h1>
      </header>

      {items.length === 0 ? (
        <p className="card text-center text-sm text-brand-navy/60">
          新着の通知はありません。
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((it, i) => (
            <Link
              key={i}
              href={it.href}
              className="card flex items-start gap-3 transition hover:shadow-md"
            >
              <div className="mt-1">
                {it.kind === "approved" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                )}
                {it.kind === "rejected" && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {it.kind === "new_review" && (
                  <MessageSquarePlus className="h-5 w-5 text-brand-pink" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{it.title}</p>
                <p className="truncate text-xs text-brand-navy/70">{it.subtitle}</p>
                <p className="mt-1 text-[11px] text-brand-navy/50">
                  {formatDate(it.at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
