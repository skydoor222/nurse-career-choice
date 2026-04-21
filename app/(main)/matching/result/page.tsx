"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCcw, Sparkles } from "lucide-react";
import { createBrowser } from "@/lib/supabase-client";
import { WardCard } from "@/components/ward-card";
import { computeUserPreference, computeMatchScore } from "@/lib/matching";
import type { MatchingAnswer, WardSummary } from "@/types";

export default function MatchingResultPage() {
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState<{ summary: WardSummary; score: number }[]>([]);
  const [hasAnswers, setHasAnswers] = useState(true);

  useEffect(() => {
    (async () => {
      let answers: MatchingAnswer[] = [];
      try {
        const raw = sessionStorage.getItem("matchingAnswers");
        if (raw) answers = JSON.parse(raw);
      } catch {}

      if (!answers.length) {
        const sb = createBrowser();
        const {
          data: { user },
        } = await sb.auth.getUser();
        if (user) {
          const { data } = await sb
            .from("matching_results")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);
          if (data?.[0]?.answers) answers = data[0].answers as MatchingAnswer[];
        }
      }

      if (!answers.length) {
        setHasAnswers(false);
        setLoading(false);
        return;
      }

      const pref = computeUserPreference(answers);
      const sb = createBrowser();
      const { data } = await sb
        .from("wards")
        .select("*, hospital:hospitals(*), reviews:reviews(*)");
      const summaries: WardSummary[] = (data ?? [])
        .filter((r: any) => r.hospital && (r.reviews?.length ?? 0) > 0)
        .map((r: any) => {
          const reviews = r.reviews ?? [];
          const n = reviews.length;
          const sum = (fn: (x: any) => number) =>
            reviews.reduce((a: number, x: any) => a + fn(x), 0);
          return {
            ward: {
              id: r.id,
              hospital_id: r.hospital_id,
              name: r.name,
              department: r.department,
              description: r.description,
              staff_count: r.staff_count,
              created_at: r.created_at,
            },
            hospital: r.hospital,
            review_count: n,
            avg_human_relations: sum((x) => x.score_human_relations) / n,
            avg_busyness: sum((x) => x.score_busyness) / n,
            avg_education: sum((x) => x.score_education) / n,
            avg_work_life: sum((x) => x.score_work_life) / n,
            avg_overtime: sum((x) => x.overtime_avg) / n,
            overtime_paid_ratio: sum((x) => (x.overtime_paid ? 1 : 0)) / n,
            pre_overtime_ratio: sum((x) => (x.pre_overtime ? 1 : 0)) / n,
            has_difficult_person_ratio:
              sum((x) => (x.has_difficult_person ? 1 : 0)) / n,
          };
        });

      const ranked = summaries
        .map((s) => ({ summary: s, score: computeMatchScore(pref, s) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      // サーバー側の scores も更新
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (user) {
        await sb
          .from("matching_results")
          .update({ scores: ranked.map((x) => ({ ward_id: x.summary.ward.id, score: x.score })) })
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);
      }

      setWards(ranked);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p className="card text-center text-sm text-ink-muted">計算中です...</p>;
  }
  if (!hasAnswers) {
    return (
      <div className="card text-center">
        <p className="text-sm text-ink-muted">
          まず診断を受けてください（10問・約2分）
        </p>
        <Link href="/matching" className="btn-primary mt-4 inline-flex">
          診断を受ける
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1 text-sm font-bold text-coral-500">
          <Sparkles className="h-4 w-4" />
          診断結果
        </p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight">あなたにマッチする上位5病棟</h1>
        <p className="mt-2 text-sm text-ink-muted">
          スコアは回答内容と各病棟のレビュー集計に基づく参考値です。
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {wards.map((w, i) => (
          <div key={w.summary.ward.id} className="relative">
            <span className="absolute -left-2 -top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-medium tracking-tight text-white">
              {i + 1}
            </span>
            <WardCard summary={w.summary} matchScore={w.score} />
          </div>
        ))}
      </div>

      {wards.length === 0 && (
        <p className="card text-center text-sm text-ink-muted">
          該当する病棟が見つかりませんでした。
        </p>
      )}

      <div className="mt-8 text-center">
        <Link href="/matching" className="btn-secondary inline-flex">
          <RefreshCcw className="h-4 w-4" />
          もう一度診断する
        </Link>
      </div>
    </div>
  );
}
