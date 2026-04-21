import Link from "next/link";
import { searchWards } from "@/lib/queries";
import { WardCard } from "@/components/ward-card";
import { DEPARTMENTS, PREFECTURES } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SP = {
  q?: string;
  prefecture?: string;
  department?: string;
  sort?: "human_relations" | "newest" | "less_overtime";
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const wards = await searchWards({
    keyword: searchParams.q,
    prefecture: searchParams.prefecture,
    department: searchParams.department,
    sort: searchParams.sort ?? "human_relations",
  });

  const sortOpts = [
    { value: "human_relations", label: "人間関係スコア順" },
    { value: "newest", label: "新着順" },
    { value: "less_overtime", label: "残業少ない順" },
  ] as const;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-black">病棟を探す</h1>
        <p className="mt-1 text-sm text-brand-navy/70">
          {wards.length}件の病棟が見つかりました
        </p>
      </header>

      <form method="get" className="card mb-6 space-y-3">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="病院名・病棟名で検索"
          className="input"
        />
        <div className="grid gap-2 sm:grid-cols-3">
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
          <select name="sort" defaultValue={searchParams.sort ?? "human_relations"} className="input">
            {sortOpts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1" type="submit">
            この条件で検索
          </button>
          <Link href="/search" className="btn-secondary">
            クリア
          </Link>
        </div>
      </form>

      {wards.length === 0 ? (
        <div className="card text-center text-sm text-brand-navy/60">
          該当する病棟がありません。条件を変えてお試しください。
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wards.map((w) => (
            <WardCard key={w.ward.id} summary={w} />
          ))}
        </div>
      )}
    </div>
  );
}
