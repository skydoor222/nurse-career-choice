import Link from "next/link";
import {
  ArrowRight,
  Star,
  Heart,
  Clock,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Lock,
  Calendar,
  MessageSquare,
  Play,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* ===== HERO ===== */}
        <section className="noise-overlay relative overflow-hidden">
          {/* aurora orbs */}
          <div className="orb left-[-8%] top-[-10%] h-[420px] w-[420px] bg-coral-300" />
          <div className="orb right-[-10%] top-[15%] h-[380px] w-[380px] bg-plum-300 opacity-40" />
          <div
            className="absolute inset-0 bg-dots opacity-60"
            aria-hidden="true"
          />

          <div className="container relative grid gap-14 pt-14 pb-20 md:grid-cols-12 md:gap-8 md:pt-24 md:pb-32">
            <div className="md:col-span-7 md:pt-4">
              <span className="eyebrow">
                <Sparkles className="h-3 w-3 text-coral-500" strokeWidth={2} />
                看護学生 × 若手ナースのための病院選び
              </span>

              <h1 className="mt-6 text-display-xl font-medium tracking-tight">
                配属ガチャに、
                <br />
                もう、
                <span className="font-display italic text-gradient-brand">
                  頼らない。
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-ink-muted">
                病棟単位で「人間関係・残業・お局の有無」まで、
                <br className="hidden md:block" />
                先輩ナースの本音がわかる。
              </p>

              {/* trust row */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <TrustChip icon={<Lock className="h-3 w-3" />}>
                  匿名投稿
                </TrustChip>
                <TrustChip icon={<ShieldCheck className="h-3 w-3" />}>
                  SSL暗号化
                </TrustChip>
                <TrustChip icon={<MessageSquare className="h-3 w-3" />}>
                  100+件のレビュー
                </TrustChip>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/register" className="btn-primary">
                  無料で病棟を探す
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                <Link
                  href="/search"
                  className="btn-ghost inline-flex items-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5" strokeWidth={2} />
                  デモを見る
                </Link>
              </div>
            </div>

            {/* BentoプレビューCardの傾け重ね */}
            <div className="relative md:col-span-5">
              <div className="relative mx-auto h-[480px] w-full max-w-sm">
                <BentoCard
                  className="absolute left-0 top-0 w-[78%] -rotate-6"
                  department="内科"
                  name="3階内科病棟"
                  score={4.6}
                  overtime={8}
                />
                <BentoCard
                  className="absolute right-0 top-24 w-[76%] rotate-3"
                  department="ICU"
                  name="5階ICU"
                  score={4.2}
                  overtime={22}
                  paidFlag
                />
                <BentoCard
                  className="absolute bottom-0 left-4 w-[74%] -rotate-3"
                  department="産科"
                  name="7階産科病棟"
                  score={4.8}
                  overtime={5}
                  paidFlag
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS STRIP ===== */}
        <section className="border-y border-hairline bg-white/50">
          <div className="container grid gap-8 py-12 md:grid-cols-3 md:gap-6">
            <Stat
              big="75%"
              label="看護師は入職前に\n十分な情報なく就職を決めている"
            />
            <Stat
              big="83%"
              label="入職後にギャップを経験\n（主に人間関係・忙しさ）"
            />
            <Stat
              big={
                <span className="font-display italic">配属ガチャ</span>
              }
              label="配属先は入職直前まで\n不明なことが大半"
            />
          </div>
        </section>

        {/* ===== 3機能 ===== */}
        <section className="section container">
          <header className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">3つの機能で選ぶ</span>
            <h2 className="mt-5 text-display-md font-medium">
              「本当のところ」を知って、
              <br className="hidden md:block" />
              <span className="font-display italic text-gradient-brand">
                自分で選ぶ。
              </span>
            </h2>
          </header>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <Feature
              num="01"
              title="病棟レビュー"
              desc="現場のリアルを病棟単位で。ネガティブな声も隠さず、数値と生の声を両方見せます。"
              accent="coral"
              href="/search"
            />
            <Feature
              num="02"
              title="1日体験インターン"
              desc="看護助手としてバイト感覚で1日参加。資格不要・面接なし・時給あり。"
              accent="ink"
              href="/internships"
            />
            <Feature
              num="03"
              title="相性マッチング"
              desc="10問・2分の価値観診断で、あなたに合う病棟をスコア付きで提案。"
              accent="plum"
              href="/matching"
            />
          </div>
        </section>

        {/* ===== 悩み訴求 ===== */}
        <section className="section bg-ink text-canvas">
          <div className="container">
            <h2 className="mx-auto max-w-3xl text-center text-display-md font-medium">
              就職前の不安、
              <span className="font-display italic">全部</span>解決したい。
            </h2>

            <div className="mx-auto mt-14 grid max-w-5xl gap-3 md:grid-cols-2">
              {[
                {
                  q: "人間関係って、実際どうなの？",
                  a: "パンフには書いてない、病棟ごとの雰囲気・お局の有無・先輩の指導スタイルまで、匿名レビューで可視化。",
                },
                {
                  q: "残業、本当にないの？",
                  a: "月平均残業時間・残業代の有無・前残業の実態まで、現職・元職員が正直に回答。",
                },
                {
                  q: "配属先で全部決まるって本当？",
                  a: "同じ病院でも、病棟次第で全く違う職場。だから「病院」ではなく「病棟」で選びます。",
                },
                {
                  q: "入ってみないと分からない？",
                  a: "1日体験インターンで、実際に現場を見てから判断できます。1日だけなら気軽。",
                },
              ].map((qa) => (
                <div
                  key={qa.q}
                  className="rounded-3xl border border-canvas/10 bg-canvas/[0.03] p-6 backdrop-blur md:p-8"
                >
                  <p className="font-medium text-canvas">Q. {qa.q}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-canvas/70">
                    {qa.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="noise-overlay relative overflow-hidden">
          <div className="orb left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 bg-coral-300 opacity-40" />
          <div className="container relative py-24 text-center md:py-32">
            <h2 className="mx-auto max-w-3xl text-display-lg font-medium">
              入職後に、
              <br />
              <span className="font-display italic text-gradient-brand">
                後悔しない
              </span>
              ために。
            </h2>
            <p className="mx-auto mt-6 max-w-md text-ink-muted">
              学生・看護師は完全無料。登録30秒で、全病棟のレビューが読めます。
            </p>
            <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="btn-primary">
                無料で始める
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link href="/search" className="btn-secondary">
                先に病棟を見る
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

function Stat({
  big,
  label,
}: {
  big: React.ReactNode;
  label: string;
}) {
  return (
    <div className="text-center md:border-r md:border-hairline md:last:border-r-0 md:text-left md:pl-8 first:pl-0">
      <p className="text-5xl font-medium tracking-tight text-ink tabular-nums md:text-6xl">
        {big}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
        {label}
      </p>
    </div>
  );
}

function TrustChip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-200/50 px-2.5 py-1 text-[11px] font-medium text-sage-700">
      {icon}
      {children}
    </span>
  );
}

function Feature({
  num,
  title,
  desc,
  accent,
  href,
}: {
  num: string;
  title: string;
  desc: string;
  accent: "coral" | "ink" | "plum";
  href: string;
}) {
  const accentMap = {
    coral: "text-coral-500",
    ink: "text-ink",
    plum: "text-plum-500",
  };
  return (
    <Link
      href={href}
      className="card card-hoverable group flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <span
          className={`font-display text-4xl italic ${accentMap[accent]}`}
        >
          {num}
        </span>
        <ArrowRight
          className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1 group-hover:text-ink"
          strokeWidth={1.5}
        />
      </div>
      <h3 className="text-xl font-medium tracking-tight">{title}</h3>
      <p className="text-[14px] leading-relaxed text-ink-muted">{desc}</p>
    </Link>
  );
}

function BentoCard({
  className = "",
  department,
  name,
  score,
  overtime,
  paidFlag,
}: {
  className?: string;
  department: string;
  name: string;
  score: number;
  overtime: number;
  paidFlag?: boolean;
}) {
  return (
    <div
      className={`card card-hoverable ${className}`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
      }}
    >
      <p className="text-[10px] text-ink-muted">病棟</p>
      <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium">
        <span className="badge badge-ink">{department}</span>
      </p>
      <h3 className="mt-3 text-lg font-medium tracking-tight">{name}</h3>
      <div className="mt-4 flex items-center gap-1.5">
        <Star className="h-4 w-4 fill-coral-500 text-coral-500" strokeWidth={1.5} />
        <span className="font-medium tabular-nums">{score.toFixed(1)}</span>
        <span className="text-[11px] text-ink-muted">人間関係</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-muted">
        <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="tabular-nums">月{overtime}時間残業</span>
      </div>
      {paidFlag && (
        <span className="badge badge-sage mt-4 inline-flex">
          残業代あり
        </span>
      )}
    </div>
  );
}
