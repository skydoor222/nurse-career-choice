import { ThumbsUp, AlertTriangle } from "lucide-react";
import type { Review } from "@/types";

export function ProsCons({ reviews }: { reviews: Review[] }) {
  if (reviews.length < 3) return null;

  const n = reviews.length;
  const avg = (fn: (r: Review) => number) =>
    reviews.reduce((a, r) => a + fn(r), 0) / n;
  const ratio = (fn: (r: Review) => boolean) =>
    reviews.filter(fn).length / n;

  const pros: string[] = [];
  const cons: string[] = [];

  const human = avg((r) => r.score_human_relations);
  const edu = avg((r) => r.score_education);
  const wlb = avg((r) => r.score_work_life);
  const busy = avg((r) => r.score_busyness);
  const overtime = avg((r) => r.overtime_avg);
  const paidRatio = ratio((r) => r.overtime_paid);
  const preRatio = ratio((r) => r.pre_overtime);
  const diffRatio = ratio((r) => r.has_difficult_person);

  if (human >= 3.8) pros.push("人間関係が良好");
  else if (human <= 2.5) cons.push("人間関係に課題あり");

  if (edu >= 3.8) pros.push("教育体制が充実");
  else if (edu <= 2.5) cons.push("教育体制が手薄");

  if (wlb >= 3.8) pros.push("ワークライフバランス◎");
  else if (wlb <= 2.5) cons.push("休みが取りにくい");

  if (overtime <= 10) pros.push(`残業少なめ(月${Math.round(overtime)}h)`);
  else if (overtime >= 30) cons.push(`残業多め(月${Math.round(overtime)}h)`);

  if (paidRatio >= 0.8) pros.push("残業代がしっかり出る");
  else if (paidRatio <= 0.3) cons.push("残業代が出ないケースあり");

  if (preRatio >= 0.5) cons.push("前残業あり");
  if (diffRatio >= 0.4) cons.push("お局・問題人物の声あり");
  if (diffRatio <= 0.15 && n >= 5) pros.push("お局の存在は少ない");

  if (busy >= 4.5) cons.push("かなり忙しい");
  else if (busy <= 2.5) pros.push("落ち着いた雰囲気");

  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="card">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <ThumbsUp className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-bold text-brand-navy/70">
            良い点（レビュー傾向）
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pros.length === 0 ? (
            <p className="text-xs text-brand-navy/50">
              データからは特筆すべき強みが見つかりませんでした
            </p>
          ) : (
            pros.map((p) => (
              <span key={p} className="badge badge-green">
                {p}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-bold text-brand-navy/70">
            注意点（レビュー傾向）
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cons.length === 0 ? (
            <p className="text-xs text-brand-navy/50">
              大きな懸念点は見られませんでした
            </p>
          ) : (
            cons.map((c) => (
              <span key={c} className="badge badge-warn">
                {c}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
