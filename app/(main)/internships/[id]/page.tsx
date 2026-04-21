import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Shirt,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { getInternship } from "@/lib/queries";
import { formatDate, formatTime } from "@/lib/utils";
import { createServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const HELPER_TASKS = [
  "シーツ・リネンの交換",
  "ベッド周りの環境整備",
  "病棟内の物品補充",
  "患者さんの配膳・下膳の補助",
  "清掃・消毒のサポート",
  "看護師さんへのちょっとした声かけ・伝達",
];

const NG_TASKS = [
  "採血・点滴など医療行為",
  "投薬・注射",
  "バイタル測定",
];

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
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
      >
        ← 体験枠一覧に戻る
      </Link>

      <section className="card">
        <p className="text-xs text-ink-muted">{it.ward?.hospital?.name}</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight">{it.ward?.name}</h1>

        <div className="mt-4 grid gap-2 text-sm text-ink/85">
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
            <span className={soldOut ? "font-bold text-red-600" : "font-bold text-coral-500"}>
              {it.remaining}枠
            </span>
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center text-emerald-700">
            <Wallet className="mx-auto h-4 w-4" />
            <p className="mt-1 font-bold">時給あり</p>
          </div>
          <div className="rounded-xl bg-blue-50 px-3 py-2 text-center text-blue-700">
            <Shirt className="mx-auto h-4 w-4" />
            <p className="mt-1 font-bold">ユニフォーム貸出</p>
          </div>
          <div className="rounded-xl bg-coral-100 px-3 py-2 text-center text-coral-500">
            <ShieldCheck className="mx-auto h-4 w-4" />
            <p className="mt-1 font-bold">資格不要</p>
          </div>
        </div>

        {it.description && (
          <div className="mt-5 rounded-xl bg-canvas p-4">
            <p className="mb-1 text-xs font-bold text-ink-muted">
              病院からのメッセージ
            </p>
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
              この体験に応募する（30秒）
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

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="card">
          <h2 className="font-bold text-emerald-700">✓ 当日やること</h2>
          <p className="mt-1 text-xs text-ink-muted">
            看護助手として、以下の業務をサポートします。
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {HELPER_TASKS.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-bold text-red-700">✗ やらないこと</h2>
          <p className="mt-1 text-xs text-ink-muted">
            医療行為は一切ありません。資格不要で安心して参加できます。
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {NG_TASKS.map((t) => (
              <li key={t} className="flex items-start gap-2 text-ink-muted">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 card">
        <h2 className="font-bold">当日の流れ</h2>
        <ol className="mt-3 space-y-2 text-sm text-ink/85">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-100 text-xs font-medium tracking-tight text-coral-500">
              1
            </span>
            受付で学生証を提示→着替え
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-100 text-xs font-medium tracking-tight text-coral-500">
              2
            </span>
            病棟師長から業務説明（15分）
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-100 text-xs font-medium tracking-tight text-coral-500">
              3
            </span>
            先輩看護師とペアで環境整備・配膳などサポート
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-100 text-xs font-medium tracking-tight text-coral-500">
              4
            </span>
            休憩時間に看護師さんと雑談、質問タイム
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-100 text-xs font-medium tracking-tight text-coral-500">
              5
            </span>
            終了後、任意で感想フィードバック
          </li>
        </ol>
        <p className="mt-4 text-[11px] text-ink-muted">
          ※ 動きやすい服装でお越しください。ユニフォームと靴は病院が貸出します。
        </p>
      </section>
    </div>
  );
}
