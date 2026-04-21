"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { QUESTIONS } from "@/lib/matching";
import { createBrowser } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "matching-draft-v1";

export default function MatchingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // 下書き復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          setShowResume(true);
          // 保留。復元は「再開」ボタンを押した時のみ
          (window as any).__matchingDraft = parsed;
        }
      }
    } catch {}
    setDraftLoaded(true);
  }, []);

  // 自動保存
  useEffect(() => {
    if (!draftLoaded) return;
    if (Object.keys(answers).length === 0) return;
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ answers, step, savedAt: Date.now() })
      );
    } catch {}
  }, [answers, step, draftLoaded]);

  const resumeDraft = () => {
    const d = (window as any).__matchingDraft;
    if (d) {
      setAnswers(d.answers ?? {});
      setStep(d.step ?? 0);
    }
    setShowResume(false);
  };

  const discardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setShowResume(false);
  };

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = ((step + 1) / total) * 100;

  const choose = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    // 選んだら 400ms 後に自動で次へ（最後の問題以外）
    if (step < total - 1) {
      setTimeout(() => setStep((s) => Math.min(total - 1, s + 1)), 350);
    }
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
      localStorage.removeItem(DRAFT_KEY);
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

  if (showResume) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-black">診断の途中保存があります</h1>
          <p className="mt-2 text-sm text-brand-navy/70">
            前回の診断を続きから再開しますか？
          </p>
          <div className="mt-5 flex gap-2">
            <button onClick={resumeDraft} className="btn-primary flex-1">
              続きから再開
            </button>
            <button onClick={discardDraft} className="btn-secondary">
              最初から
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gradient-to-br from-white via-brand-bg to-brand-pink/5">
      {/* Top bar */}
      <header className="shrink-0 border-b border-black/5 bg-white/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/home")}
            aria-label="閉じる"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-navy/60 hover:bg-black/5 hover:text-brand-navy"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="inline-flex items-center gap-1 text-brand-pink">
                <Sparkles className="h-3 w-3" />
                相性診断
              </span>
              <span className="tabular-nums text-brand-navy/60">
                {step + 1} / {total}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-brand-pink transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="flex flex-1 items-center justify-center overflow-auto px-5 py-6">
        <div key={q.id} className="mx-auto w-full max-w-xl animate-[fadeInUp_0.3s_ease-out]">
          <p className="text-xs font-bold text-brand-pink">Q{step + 1}</p>
          <h1 className="mt-2 text-2xl font-black leading-snug md:text-3xl">
            {q.text}
          </h1>

          <div className="mt-6 grid gap-2.5">
            {q.options.map((o) => {
              const selected = answers[q.id] === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => choose(o.value)}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl border-2 bg-white px-5 py-4 text-left font-bold transition-all",
                    selected
                      ? "border-brand-pink bg-brand-pink/10 text-brand-pink"
                      : "border-transparent text-brand-navy hover:border-brand-pink/30 hover:shadow-md"
                  )}
                >
                  <span>{o.label}</span>
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2 transition",
                      selected
                        ? "border-brand-pink bg-brand-pink text-white"
                        : "border-brand-navy/15 group-hover:border-brand-pink/40"
                    )}
                  >
                    {selected ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>

          {hasAnswer && isLast && (
            <div className="mt-6 rounded-2xl bg-brand-pink/10 p-4 text-center text-xs text-brand-pink">
              全問回答しました！最後のボタンで結果を見る →
            </div>
          )}
        </div>
      </main>

      {/* Bottom nav */}
      <footer className="shrink-0 border-t border-black/5 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </button>
          <p className="hidden text-[10px] text-brand-navy/50 sm:block">
            回答は自動で保存されます
          </p>
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
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
