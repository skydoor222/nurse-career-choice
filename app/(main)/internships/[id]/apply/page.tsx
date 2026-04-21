import { notFound, redirect } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
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
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-black">応募フォーム</h1>

      <div className="mt-4 card">
        <p className="text-xs text-brand-navy/60">{it.ward?.hospital?.name}</p>
        <h2 className="font-bold">{it.ward?.name}</h2>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-brand-navy/70">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(it.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(it.start_time)}〜{formatTime(it.end_time)}
          </span>
        </div>
      </div>

      <form action={submitApply} className="mt-6 card space-y-4">
        <input type="hidden" name="internship_id" value={it.id} />

        <div>
          <label className="mb-1 block text-xs font-bold">氏名</label>
          <input
            defaultValue={profile?.display_name ?? ""}
            className="input bg-brand-bg"
            readOnly
          />
          <p className="mt-1 text-[11px] text-brand-navy/60">
            プロフィールの表示名を使用します。変更はマイページから。
          </p>
        </div>

        {profile?.user_type === "student" && (
          <div>
            <label className="mb-1 block text-xs font-bold">学校名</label>
            <input
              defaultValue={profile?.school_name ?? ""}
              className="input bg-brand-bg"
              readOnly
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-bold">
            志望動機 <span className="font-normal text-brand-navy/60">(任意)</span>
          </label>
          <textarea
            name="motivation"
            rows={6}
            className="input resize-none"
            placeholder="例：この病棟の忙しさや雰囲気を体験してから就職先を決めたいです。"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          応募を送信する
        </button>
        <p className="text-center text-xs text-brand-navy/60">
          送信後、病院側の承認をもって確定となります。
        </p>
      </form>
    </div>
  );
}
