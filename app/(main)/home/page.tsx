import Link from "next/link";
import { Heart, Calendar, Sparkles, ArrowRight, Clock } from "lucide-react";
import { createServer } from "@/lib/supabase";
import { searchWards } from "@/lib/queries";
import { WardCard } from "@/components/ward-card";
import { ReviewCard } from "@/components/review-card";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.display_name) redirect("/profile/setup");

  const wards = await searchWards({
    prefecture: profile?.preferred_prefecture ?? undefined,
    sort: "human_relations",
  });
  const recommended = wards.slice(0, 4);

  const { data: recentReviews } = await sb
    .from("reviews")
    .select("*, ward:wards(*, hospital:hospitals(*))")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-black">
          こんにちは、{profile.display_name}さん
        </h1>
        <p className="mt-1 text-sm text-brand-navy/70">
          今日もあなたに合う病棟探しを。
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <FeatureLink
          href="/search"
          icon={<Heart className="h-5 w-5" />}
          title="病棟レビュー"
          desc="現場のリアルを病棟単位で"
        />
        <FeatureLink
          href="/internships"
          icon={<Calendar className="h-5 w-5" />}
          title="単発インターン"
          desc="1日体験に応募する"
        />
        <FeatureLink
          href="/matching"
          icon={<Sparkles className="h-5 w-5" />}
          title="相性マッチング"
          desc="10問診断で合う病棟"
        />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-black">
            {profile.preferred_prefecture
              ? `${profile.preferred_prefecture}のおすすめ病棟`
              : "おすすめ病棟"}
          </h2>
          <Link href="/search" className="text-sm font-bold text-brand-pink">
            すべて見る →
          </Link>
        </div>
        {recommended.length === 0 ? (
          <p className="card text-sm text-brand-navy/60">
            該当する病棟がまだありません。検索条件を広げてみてください。
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((w) => (
              <WardCard key={w.ward.id} summary={w} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-black">最近の新着レビュー</h2>
        </div>
        {recentReviews?.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {recentReviews.map((r: any) => (
              <Link key={r.id} href={`/wards/${r.ward_id}`} className="block">
                <div className="card">
                  <p className="text-xs text-brand-navy/60">
                    {r.ward?.hospital?.name} · {r.ward?.name}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-brand-navy/80">
                    {r.body}
                  </p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-brand-navy/60">
                    <Clock className="h-3 w-3" />
                    月{r.overtime_avg}時間残業
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="card text-sm text-brand-navy/60">まだレビューがありません。</p>
        )}
      </section>
    </div>
  );
}

function FeatureLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="card flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold">{title}</p>
        <p className="text-xs text-brand-navy/60">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-brand-navy/40" />
    </Link>
  );
}
