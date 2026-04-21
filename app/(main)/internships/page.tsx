import Link from "next/link";
import { Calendar, Clock, MapPin, Sparkles, Shirt, Wallet } from "lucide-react";
import { getInternships } from "@/lib/queries";
import { DEPARTMENTS, PREFECTURES, formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SP = {
  department?: string;
  prefecture?: string;
  dateFrom?: string;
};

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const internships = await getInternships(searchParams);

  return (
    <div>
      <header className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-pink via-[#ff5a9a] to-[#ff8cb5] p-6 text-white md:p-8">
        <p className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur">
          <Sparkles className="h-3 w-3" />
          学生向け・バイト感覚でOK
        </p>
        <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
          1日だけ、
          <br className="md:hidden" />
          病棟に潜入してみる。
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90">
          <strong className="text-white">看護助手として</strong>
          シーツ交換や環境整備を体験。
          医療行為なし、<strong className="text-white">資格不要</strong>
          。実習より気軽に、アルバイト感覚で現場の雰囲気が分かります。
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-bold">
            <Wallet className="h-3 w-3" />
            時給あり（目安: 1,100〜1,500円）
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-bold">
            <Shirt className="h-3 w-3" />
            ユニフォームは病院貸出
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-bold">
            面接なし・履歴書不要
          </span>
        </div>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <HowCard step={1} title="日程を選ぶ" desc="学校終わりの夕方〜1日OK。自分の都合に合わせて応募。" />
        <HowCard step={2} title="簡単フォーム" desc="名前と志望動機を入力。履歴書なしで30秒。" />
        <HowCard step={3} title="当日は看護助手として" desc="シーツ交換・配膳・環境整備など。医療行為は一切なし。" />
      </section>

      <form
        method="get"
        className="card mb-6 grid gap-2 sm:grid-cols-3"
        aria-label="絞り込み検索"
      >
        <select name="prefecture" defaultValue={searchParams.prefecture ?? ""} className="input">
          <option value="">すべての都道府県</option>
          {PREFECTURES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select name="department" defaultValue={searchParams.department ?? ""} className="input">
          <option value="">すべての診療科</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="dateFrom"
          defaultValue={searchParams.dateFrom}
          className="input"
        />
        <button className="btn-primary sm:col-span-3" type="submit">
          絞り込む
        </button>
      </form>

      <h2 className="mb-3 text-sm font-black text-brand-navy/70">
        募集中の体験枠 ({internships.length}件)
      </h2>
      {internships.length === 0 ? (
        <p className="card text-sm text-brand-navy/60">
          条件に合う体験枠が見つかりませんでした。
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {internships.map((it: any) => (
            <Link
              key={it.id}
              href={`/internships/${it.id}`}
              className="card block transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="truncate text-xs text-brand-navy/60">
                    {it.ward?.hospital?.name}
                  </p>
                  <h3 className="truncate text-lg font-bold">{it.ward?.name}</h3>
                </div>
                <span
                  className={`badge ${
                    it.remaining > 0 ? "badge-pink" : "badge-red"
                  }`}
                >
                  残り{it.remaining}枠
                </span>
              </div>
              <div className="mt-3 grid gap-1 text-sm text-brand-navy/70">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(it.date)}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTime(it.start_time)}〜{formatTime(it.end_time)}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {it.ward?.hospital?.prefecture} · {it.ward?.department}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function HowCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="card flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-pink/10 font-black text-brand-pink">
        {step}
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-xs text-brand-navy/70">{desc}</p>
      </div>
    </div>
  );
}
