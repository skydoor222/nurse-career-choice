"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { QUESTIONS } from "@/lib/matching";
import { createBrowser } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

export default function MatchingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = ((step + 1) / total) * 100;

  const choose = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const next = () => setStep((s) => Math.min(total - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const finish = async () => {
    setSubmitting(true);
    const payload = Object.entries(answers).map(([qid, v]) => ({
      questionId: Number(qid),
      value: v,
    }));

    try {
      sessionStorage.setItem("matchingAnswers", JSON.stringify(payload));
    } catch {}

    const sb = createBrowser();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (user) {
      await sb.from("matching_results").insert({
        user_id: user.id,
        answers: payload,
        scores: {},
      });
    }
    router.push("/matching/result");
  };

  const hasAnswer = answers[q.id];
  const isLast = step === total - 1;

  return (
    <div className="mx-auto max-w-xl">
      <header className="mb-4">
        <div className="flex items-center justify-between text-xs text-brand-navy/60">
          <span className="inline-flex items-center gap-1 font-bold text-brand-pink">
            <Sparkles className="h-3.5 w-3.5" /> 相性診断
          </span>
          <span>
            {step + 1} / {total}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-brand-pink transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="card">
        <h1 className="text-xl font-black leading-snug">{q.text}</h1>
        <div className="mt-5 grid gap-2">
          {q.options.map((o) => {
            const selected = answers[q.id] === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => choose(o.value)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm font-bold transition",
                  selected
                    ? "border-brand-pink bg-brand-pink/10 text-brand-pink"
                    : "border-black/10 bg-white text-brand-navy hover:bg-black/5"
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </button>
          {isLast ? (
            <button
              type="button"
              disabled={!hasAnswer || submitting}
              onClick={finish}
              className="btn-primary"
            >
              {submitting ? "計算中..." : "結果を見る"}
              <Sparkles className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!hasAnswer}
              onClick={next}
              className="btn-primary"
            >
              次へ <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
