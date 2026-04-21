import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
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
      <header className="mb-6">
        <h1 className="text-2xl font-black">単発インターン</h1>
        <p className="mt-2 rounded-xl bg-brand-pink/10 p-3 text-sm text-brand-navy/80">
          看護助手として1日体験。
          <span className="font-bold text-brand-pink">資格不要</span>
          ・バイト感覚で現場を知れます。
        </p>
      </header>

      <form method="get" className="card mb-6 grid gap-2 sm:grid-cols-3">
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
