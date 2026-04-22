import Link from "next/link";
import { Calendar, Clock, MapPin, Sparkles, Wallet } from "lucide-react";
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
      <header className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-coral-500 via-[#ff5a9a] to-[#ff8cb5] p-6 text-white md:p-8">
        <p className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur">
          <Sparkles className="h-3 w-3" />
          1日から体験できる
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-tight leading-tight md:text-3xl">
          入職前に、
          <br className="md:hidden" />
          現場の空気を確かめる。
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90">
          看護助手として病棟に入り、チームの雰囲気・業務のテンポ・スタッフの関わり方をリアルに確認。
          <strong className="text-white">医療行為なし・資格不要</strong>
          。転職先を決める前に、自分の目で見て判断できます。
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-bold">
            <Wallet className="h-3 w-3" />
            参加費無料・交通費支給あり
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-bold">
            事前面接なし
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-bold">
            現役・離職中どちらも参加可
          </span>
        </div>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <HowCard step={1} title="日程を選ぶ" desc="1日単位で参加可能。複数の病棟を比較するのにも使えます。" />
        <HowCard step={2} title="簡単フォーム" desc="名前と参加目的を入力するだけ。書類選考はありません。" />
        <HowCard step={3} title="当日、現場を体験" desc="看護助手として環境整備・配膳などをサポート。スタッフと直接話せます。" />
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

      <h2 className="mb-3 text-sm font-medium tracking-tight text-ink-muted">
        受付中の体験枠 ({internships.length}件)
      </h2>
      {internships.length === 0 ? (
        <p className="card text-sm text-ink-muted">
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
                  <p className="truncate text-xs text-ink-muted">
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
              <div className="mt-3 grid gap-1 text-sm text-ink-muted">
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
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral-100 font-medium tracking-tight text-coral-500">
        {step}
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{desc}</p>
      </div>
    </div>
  );
}
