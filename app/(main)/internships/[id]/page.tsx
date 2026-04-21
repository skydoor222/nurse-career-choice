import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { getInternship } from "@/lib/queries";
import { formatDate, formatTime } from "@/lib/utils";
import { createServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function InternshipDetail({
  params,
}: {
  params: { id: string };
}) {
  const it = await getInternship(params.id);
  if (!it) notFound();

  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  let alreadyApplied = false;
  if (user) {
    const { data } = await sb
      .from("bookings")
      .select("id")
      .eq("user_id", user.id)
      .eq("internship_id", it.id)
      .maybeSingle();
    alreadyApplied = !!data;
  }

  const soldOut = it.remaining <= 0;

  return (
    <div>
      <Link
        href="/internships"
        className="mb-4 inline-flex items-center gap-1 text-sm text-brand-navy/60 hover:text-brand-navy"
      >
        ← 体験枠一覧に戻る
      </Link>

      <section className="card">
        <p className="text-xs text-brand-navy/60">{it.ward?.hospital?.name}</p>
        <h1 className="mt-1 text-2xl font-black">{it.ward?.name}</h1>

        <div className="mt-4 grid gap-2 text-sm text-brand-navy/80">
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
            {it.ward?.hospital?.prefecture} {it.ward?.hospital?.address}
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            定員{it.capacity}名 / 残り
            <span className={soldOut ? "font-bold text-red-600" : "font-bold text-brand-pink"}>
              {it.remaining}枠
            </span>
          </p>
        </div>

        {it.description && (
          <div className="mt-5 rounded-xl bg-brand-bg p-4">
            <p className="mb-1 text-xs font-bold text-brand-navy/70">業務内容</p>
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {it.description}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {alreadyApplied ? (
            <span className="btn-secondary cursor-not-allowed">
              応募済み（マイページから確認）
            </span>
          ) : soldOut ? (
            <button disabled className="btn-secondary cursor-not-allowed opacity-60">
              残り0枠のため応募できません
            </button>
          ) : (
            <Link href={`/internships/${it.id}/apply`} className="btn-primary">
              この体験に応募する
            </Link>
          )}

          <Link
            href={`/wards/${it.ward_id}`}
            className="btn-secondary"
          >
            病棟レビューを見る <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-6 card">
        <h2 className="font-bold">注意事項</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-brand-navy/80">
          <li>看護助手としての参加のため、医療行為は行いません。資格不要でご参加いただけます。</li>
          <li>動きやすい服装でお越しください。ユニフォームは病院側が用意します。</li>
          <li>応募後、病院側の承認をもって確定となります。ステータスはマイページで確認できます。</li>
        </ul>
      </section>
    </div>
  );
}
