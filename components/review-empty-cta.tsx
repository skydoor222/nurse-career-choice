import { MessageSquarePlus, Lock } from "lucide-react";

export function ReviewEmptyCTA({ count }: { count: number }) {
  const isLow = count > 0 && count < 5;
  const isEmpty = count === 0;

  if (count >= 5) return null;

  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-pink/40 bg-brand-pink/5 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink/15 text-brand-pink">
        <MessageSquarePlus className="h-6 w-6" />
      </div>
      <h3 className="mt-3 font-black text-brand-navy">
        {isEmpty
          ? "まだレビューがありません"
          : `レビューは${count}件。あと${5 - count}件で参考になります`}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-brand-navy/70">
        あなたの1票が、後輩の就職先選びを救います。
        匿名・3分で投稿できます。
      </p>
      <button
        type="button"
        className="btn-primary mt-4"
        onClick={() => alert("MVPでは手動投入のみ対応。次フェーズで投稿機能を公開予定です。")}
      >
        <MessageSquarePlus className="h-4 w-4" />
        匿名でレビューを書く
      </button>
      <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-brand-navy/60">
        <Lock className="h-3 w-3" />
        投稿者特定は一切しません。IPも保存しません。
      </p>
    </div>
  );
}
