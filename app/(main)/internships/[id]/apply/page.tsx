import { notFound, redirect } from "next/navigation";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Wallet,
  Shirt,
} from "lucide-react";
import { getInternship } from "@/lib/queries";
import { createServer } from "@/lib/supabase";
import { formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function submitApply(formData: FormData) {
  "use server";
  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const internship_id = String(formData.get("internship_id"));
  const motivation = String(formData.get("motivation") ?? "").slice(0, 2000);

  const { data: it } = await sb
    .from("internships")
    .select("remaining")
    .eq("id", internship_id)
    .single();
  if (!it || it.remaining <= 0) redirect(`/internships/${internship_id}`);

  const { error } = await sb.from("bookings").insert({
    user_id: user.id,
    internship_id,
    motivation,
    status: "pending",
  });
  if (error) {
    redirect(`/internships/${internship_id}?err=1`);
  }
  await sb
    .from("internships")
    .update({ remaining: it.remaining - 1 })
    .eq("id", internship_id);

  redirect(`/internships/${internship_id}/complete`);
}

export default async function ApplyPage({ params }: { params: { id: string } }) {
  const it = await getInternship(params.id);
  if (!it) notFound();

  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=/internships/${params.id}/apply`);

  const { data: profile } = await sb
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-lg">
      {/* ミニプログレス */}
      <nav aria-label="応募ステップ" className="mb-5 flex items-center gap-2 text-xs">
        <Step n={1} label="内容確認" state="done" />
        <span className="h-px flex-1 bg-coral-500" />
        <Step n={2} label="情報入力" state="active" />
        <span className="h-px flex-1 bg-black/10" />
        <Step n={3} label="完了" state="todo" />
      </nav>

      <h1 className="text-2xl font-medium tracking-tight">応募内容の確認</h1>
      <p className="mt-1 text-sm text-ink-muted">
        履歴書不要・面接なし。送信後すぐ病院に通知されます。
      </p>

      {/* 応募内容 */}
      <div className="mt-4 card">
        <p className="text-xs text-ink-muted">
          {it.ward?.hospital?.name}
        </p>
        <h2 className="font-bold">{it.ward?.name}</h2>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-ink/85">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(it.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(it.start_time)}〜{formatTime(it.end_time)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <span className="badge badge-green">
            <Wallet className="h-3 w-3" />
            時給あり
          </span>
          <span className="badge badge-navy">
            <Shirt className="h-3 w-3" />
            服貸出
          </span>
          <span className="badge badge-pink">
            <ShieldCheck className="h-3 w-3" />
            資格不要
          </span>
        </div>
      </div>

      {/* フォーム */}
      <form action={submitApply} className="mt-4 card space-y-4">
        <input type="hidden" name="internship_id" value={it.id} />

        <div>
          <p className="text-xs font-bold">お名前</p>
          <p className="mt-1 flex items-center gap-2 rounded-lg bg-canvas px-4 py-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {profile?.display_name ?? "（未設定）"}
          </p>
          <p className="mt-1 text-[10px] text-ink-muted">
            マイページで変更できます
          </p>
        </div>

        {profile?.user_type === "student" && profile?.school_name && (
          <div>
            <p className="text-xs font-bold">学校名</p>
            <p className="mt-1 flex items-center gap-2 rounded-lg bg-canvas px-4 py-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {profile.school_name}
            </p>
          </div>
        )}

        <div>
          <label className="text-xs font-bold">
            志望動機・ひと言 <span className="font-normal text-ink-soft">(任意・10秒でOK)</span>
          </label>
          <textarea
            name="motivation"
            rows={3}
            maxLength={400}
            className="input mt-1 resize-none"
            placeholder="例）就職前にリアルな雰囲気を知りたいです！"
          />
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-base">
          この内容で応募する
        </button>
        <p className="text-center text-[11px] text-ink-muted">
          送信後、病院側の承認をもって確定。キャンセルはマイページから可能です。
        </p>
      </form>
    </div>
  );
}

function Step({
  n,
  label,
  state,
}: {
  n: number;
  label: string;
  state: "done" | "active" | "todo";
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium tracking-tight ${
          state === "done"
            ? "bg-coral-500 text-white"
            : state === "active"
            ? "bg-coral-500 text-white ring-4 ring-coral-300"
            : "bg-black/10 text-ink-soft"
        }`}
      >
        {state === "done" ? "✓" : n}
      </span>
      <span
        className={`font-bold ${
          state === "todo" ? "text-ink-soft" : "text-ink"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
