import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Clock, LogOut, Heart, Sparkles } from "lucide-react";
import { createServer } from "@/lib/supabase";
import { WardCard } from "@/components/ward-card";
import { summarizeReviews } from "@/lib/queries";
import { formatDate, formatTime } from "@/lib/utils";
import type { WardSummary } from "@/types";

export const dynamic = "force-dynamic";

async function signOut() {
  "use server";
  const sb = createServer();
  await sb.auth.signOut();
  redirect("/");
}

export default async function MyPage({
  searchParams,
}: {
  searchParams: { tab?: "bookings" | "favorites" | "results" };
}) {
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

  const tab = searchParams.tab ?? "bookings";

  const { data: bookings } = await sb
    .from("bookings")
    .select(
      "*, internship:internships(*, ward:wards(*, hospital:hospitals(*)))"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: favs } = await sb
    .from("favorites")
    .select("*, ward:wards(*, hospital:hospitals(*), reviews:reviews(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const favSummaries: WardSummary[] = (favs ?? [])
    .filter((f: any) => f.ward && f.ward.hospital)
    .map((f: any) => {
      const s = summarizeReviews(f.ward.reviews ?? []);
      return {
        ward: f.ward,
        hospital: f.ward.hospital,
        ...s,
      };
    });

  const { data: results } = await sb
    .from("matching_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <header className="card mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-muted">
            {profile?.user_type === "student" ? "看護学生" : "看護師"}
          </p>
          <h1 className="text-xl font-medium tracking-tight">
            {profile?.display_name ?? "ゲスト"}
          </h1>
          <p className="mt-1 text-xs text-ink-muted">
            {profile?.preferred_prefecture ?? "希望エリア未設定"}
            {profile?.school_name ? ` · ${profile.school_name}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link href="/profile/setup" className="text-xs font-bold text-coral-500">
            プロフィール編集
          </Link>
          <form action={signOut}>
            <button className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink">
              <LogOut className="h-3 w-3" />
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <div className="mb-5 flex gap-2 border-b border-black/10">
        <TabLink tab="bookings" current={tab} label="予約履歴" icon={<Calendar className="h-3.5 w-3.5" />} />
        <TabLink tab="favorites" current={tab} label="お気に入り" icon={<Heart className="h-3.5 w-3.5" />} />
        <TabLink tab="results" current={tab} label="診断結果" icon={<Sparkles className="h-3.5 w-3.5" />} />
      </div>

      {tab === "bookings" && (
        <div className="space-y-3">
          {bookings?.length ? (
            bookings.map((b: any) => (
              <Link
                key={b.id}
                href={`/internships/${b.internship_id}`}
                className="card block transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-ink-muted">
                      {b.internship?.ward?.hospital?.name}
                    </p>
                    <p className="font-bold">{b.internship?.ward?.name}</p>
                    <p className="mt-2 flex items-center gap-3 text-xs text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {b.internship?.date && formatDate(b.internship.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {b.internship?.start_time &&
                          formatTime(b.internship.start_time)}
                      </span>
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              </Link>
            ))
          ) : (
            <p className="card text-center text-sm text-ink-muted">
              まだ応募履歴がありません。
            </p>
          )}
        </div>
      )}

      {tab === "favorites" && (
        <>
          {favSummaries.length === 0 ? (
            <p className="card text-center text-sm text-ink-muted">
              お気に入りの病棟はまだありません。
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favSummaries.map((s) => (
                <WardCard key={s.ward.id} summary={s} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "results" && (
        <div className="space-y-3">
          {results?.length ? (
            results.map((r: any) => (
              <Link
                key={r.id}
                href="/matching/result"
                className="card flex items-center justify-between transition hover:shadow-md"
              >
                <div>
                  <p className="font-bold">診断結果</p>
                  <p className="text-xs text-ink-muted">
                    {formatDate(r.created_at)}
                  </p>
                </div>
                <span className="text-xs font-bold text-coral-500">再表示 →</span>
              </Link>
            ))
          ) : (
            <div className="card text-center">
              <p className="text-sm text-ink-muted">まだ診断履歴がありません。</p>
              <Link href="/matching" className="btn-primary mt-4 inline-flex">
                診断を受ける
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabLink({
  tab,
  current,
  label,
  icon,
}: {
  tab: "bookings" | "favorites" | "results";
  current: string;
  label: string;
  icon: React.ReactNode;
}) {
  const active = tab === current;
  return (
    <Link
      href={`/mypage?tab=${tab}`}
      className={`flex items-center gap-1 border-b-2 px-3 py-2 text-sm font-bold ${
        active
          ? "border-coral-500 text-coral-500"
          : "border-transparent text-ink-muted hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    pending: { cls: "badge-warn", label: "承認待ち" },
    approved: { cls: "badge-green", label: "承認済み" },
    rejected: { cls: "badge-red", label: "不承認" },
    cancelled: { cls: "badge-navy", label: "キャンセル" },
  };
  const s = map[status] ?? { cls: "badge-navy", label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
