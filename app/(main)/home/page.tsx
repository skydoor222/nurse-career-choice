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

  const { data: lastResult } = await sb
    .from("matching_results")
    .select("id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);
  const hasDiagnosed = !!lastResult?.[0];

  return (
    <div className="space-y-20 pb-6">
      {/* Hero greeting */}
      <section className="pt-2 md:pt-6">
        <p className="text-[13px] text-ink-muted">
          ようこそ、{profile.display_name}さん
        </p>
        <h1 className="mt-2 max-w-3xl text-display-lg font-medium leading-[1.05]">
          {hasDiagnosed ? (
            <>
              今日も、あなたに合う
              <br />
              病棟を
              <span className="font-display italic text-gradient-brand">
                探そう。
              </span>
            </>
          ) : (
            <>
              まずは、
              <span className="font-display italic text-gradient-brand">
                相性診断
              </span>
              から。
            </>
          )}
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          {!hasDiagnosed && (
            <Link href="/matching" className="btn-primary">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              10問・2分で診断する
            </Link>
          )}
          <Link
            href="/search"
            className={hasDiagnosed ? "btn-primary" : "btn-secondary"}
          >
            病棟を探す
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* 今週の注目 */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="eyebrow">
              <TrendingUp className="h-3 w-3 text-coral-500" strokeWidth={2} />
              今週の注目
            </span>
            <h2 className="mt-3 text-display-md font-medium tracking-tight">
              {profile.preferred_prefecture
                ? `${profile.preferred_prefecture}で評価の高い病棟`
                : "評価の高い病棟"}
            </h2>
          </div>
          <Link href="/search" className="btn-ghost text-[13px]">
            すべて見る
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
        {topPicks.length === 0 ? (
          <p className="card text-sm text-ink-muted">
            該当する病棟がまだありません。希望エリアを変更してみてください。
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {topPicks.map((w) => (
              <WardCard key={w.ward.id} summary={w} />
            ))}
          </div>
        )}
      </section>

      {/* 3機能 */}
      <section>
        <h2 className="mb-6 text-display-md font-medium tracking-tight">
          3つの機能で選ぶ
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <BigFeatureCard
            href="/search"
            num="01"
            title="病棟レビュー"
            desc="現場のリアルを病棟単位で。"
            accent="coral"
          />
          <BigFeatureCard
            href="/internships"
            num="02"
            title="1日体験インターン"
            desc="看護助手としてバイト感覚で。"
            accent="ink"
          />
          <BigFeatureCard
            href="/matching"
            num="03"
            title="相性マッチング"
            desc="10問診断で合う病棟が分かる。"
            accent="plum"
          />
        </div>
      </section>

      {/* 新着レビュー */}
      {recentReviews && recentReviews.length > 0 && (
        <section>
          <h2 className="mb-6 text-display-md font-medium tracking-tight">
            最近の新着レビュー
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recentReviews.map((r: any) => (
              <Link
                key={r.id}
                href={`/wards/${r.ward_id}`}
                className="card card-hoverable block"
              >
                <p className="text-[11px] text-ink-muted">
                  {r.ward?.hospital?.name} · {r.ward?.name}
                </p>
                <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink/80">
                  {r.body}
                </p>
                <p className="mt-4 inline-flex items-center gap-1 text-[11px] text-ink-soft tabular-nums">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />月
                  {r.overtime_avg}時間残業
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
  num,
  title,
  desc,
  accent,
}: {
  href: string;
  num: string;
  title: string;
  desc: string;
  accent: "coral" | "ink" | "plum";
}) {
  const accentMap = {
    coral: "text-coral-500",
    ink: "text-ink",
    plum: "text-plum-500",
  };
  return (
    <Link
      href={href}
      className="card card-hoverable group flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <span className={`font-display text-4xl italic ${accentMap[accent]}`}>
          {num}
        </span>
        <ArrowRight
          className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1 group-hover:text-ink"
          strokeWidth={1.5}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium tracking-tight">{title}</h3>
        <p className="mt-1.5 text-[14px] text-ink-muted">{desc}</p>
      </div>
    </Link>
  );
}
