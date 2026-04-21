import Link from "next/link";
import {
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { createServer } from "@/lib/supabase";
import { searchWards } from "@/lib/queries";
import { WardCard } from "@/components/ward-card";
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
  const topPicks = wards.slice(0, 3);

  const { data: recentReviews } = await sb
    .from("reviews")
    .select("*, ward:wards(*, hospital:hospitals(*))")
    .order("created_at", { ascending: false })
    .limit(3);

  // 診断結果の有無
  const { data: lastResult } = await sb
    .from("matching_results")
    .select("id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);
  const hasDiagnosed = !!lastResult?.[0];

  return (
    <div className="space-y-12 pb-4">
      {/* ヒーロー */}
      <section>
        <p className="text-xs text-brand-navy/60">
          こんにちは、{profile.display_name}さん
        </p>
        <h1 className="mt-1 text-3xl font-black leading-tight md:text-4xl">
          {hasDiagnosed
            ? "今日も、あなたに合う\n病棟を探そう。"
            : "まずは、相性診断から\nはじめませんか？"}
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {!hasDiagnosed && (
            <Link href="/matching" className="btn-primary">
              <Sparkles className="h-4 w-4" />
              10問・2分で診断する
            </Link>
          )}
          <Link
            href="/search"
            className={hasDiagnosed ? "btn-primary" : "btn-secondary"}
          >
            病棟を探す
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* トップピック（大判カード） */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="inline-flex items-center gap-1 text-xs font-bold text-brand-pink">
              <TrendingUp className="h-3.5 w-3.5" />
              今週の注目
            </p>
            <h2 className="mt-1 text-xl font-black">
              {profile.preferred_prefecture
                ? `${profile.preferred_prefecture}で評価の高い病棟`
                : "評価の高い病棟"}
            </h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-brand-pink">
            すべて見る →
          </Link>
        </div>
        {topPicks.length === 0 ? (
          <p className="card text-sm text-brand-navy/60">
            該当する病棟がまだありません。希望エリアを変更してみてください。
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {topPicks.map((w) => (
              <WardCard key={w.ward.id} summary={w} />
            ))}
          </div>
        )}
      </section>

      {/* 3機能導線（シンプルな大判） */}
      <section>
        <h2 className="mb-4 text-xl font-black">3つの機能で選ぶ</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <BigFeatureCard
            href="/search"
            icon={<Heart className="h-6 w-6" />}
            title="病棟レビュー"
            desc="現場のリアルを病棟単位で。"
            color="pink"
          />
          <BigFeatureCard
            href="/internships"
            icon={<Calendar className="h-6 w-6" />}
            title="1日体験インターン"
            desc="看護助手としてバイト感覚で。"
            color="navy"
          />
          <BigFeatureCard
            href="/matching"
            icon={<Sparkles className="h-6 w-6" />}
            title="相性マッチング"
            desc="10問診断で合う病棟が分かる。"
            color="pink"
          />
        </div>
      </section>

      {/* 新着レビュー（簡潔に） */}
      {recentReviews && recentReviews.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-black">最近の新着レビュー</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {recentReviews.map((r: any) => (
              <Link key={r.id} href={`/wards/${r.ward_id}`} className="card block">
                <p className="text-xs text-brand-navy/60">
                  {r.ward?.hospital?.name} · {r.ward?.name}
                </p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-navy/80">
                  {r.body}
                </p>
                <p className="mt-3 flex items-center gap-1 text-xs text-brand-navy/60">
                  <Clock className="h-3 w-3" />
                  月{r.overtime_avg}時間残業
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BigFeatureCard({
  href,
  icon,
  title,
  desc,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: "pink" | "navy";
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-3 rounded-2xl p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        color === "pink"
          ? "bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 hover:from-brand-pink/15"
          : "bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 hover:from-brand-navy/10"
      }`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
          color === "pink"
            ? "bg-brand-pink text-white"
            : "bg-brand-navy text-white"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-black">{title}</h3>
        <p className="mt-1 text-sm text-brand-navy/70">{desc}</p>
      </div>
      <p
        className={`mt-auto flex items-center gap-1 text-sm font-bold ${
          color === "pink" ? "text-brand-pink" : "text-brand-navy"
        }`}
      >
        開く
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </p>
    </Link>
  );
}
