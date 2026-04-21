import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CompletePage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-md pt-6">
      <div className="card text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral-100 text-coral-500">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-medium tracking-tight">応募を受け付けました</h1>
        <p className="mt-3 text-sm text-ink-muted">
          病院側の承認をもって確定となります。結果はマイページの「予約履歴」、
          または通知でお知らせします。
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/mypage" className="btn-primary">
            マイページで確認する
          </Link>
          <Link href={`/internships/${params.id}`} className="btn-secondary">
            この体験枠の詳細に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
