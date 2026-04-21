import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Calendar,
  Sparkles,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { TrustFooter } from "@/components/trust-footer";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy to-[#1a2052] text-white">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-pink/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-pink/10 blur-3xl" />
          <div className="container relative grid gap-10 py-16 md:grid-cols-2 md:py-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
                看護学生・若手ナースのための就職選び
              </p>
              <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                配属ガチャに、
                <br />
                もう、頼らない。
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/80 md:text-lg">
                病棟単位で「人間関係」「残業」「お局の有無」までわかる。
                <br className="hidden md:block" />
                入職前に現場を知れる、新しい病院選びのスタンダード。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="btn-primary">
                  学生・看護師は完全無料で登録
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/10"
                >
                  先に病棟を見てみる
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Stat
                    label="入職前に情報を持たずに就職先を決めた看護師"
                    value="75%"
                    icon={<AlertTriangle className="h-5 w-5" />}
                  />
                  <Stat
                    label="入職後にギャップを経験した"
                    value="83%"
                    icon={<AlertTriangle className="h-5 w-5" />}
                  />
                  <Stat
                    label="配属先が入職直前まで不明"
                    value="配属ガチャ"
                    icon={<AlertTriangle className="h-5 w-5" />}
                  />
                </div>
                <p className="mt-4 text-xs text-white/60">
                  ※ 看護師就労実態調査をもとに当社推計
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3機能 */}
        <section className="container py-16 md:py-24">
          <header className="text-center">
            <p className="text-sm font-bold text-brand-pink">3つの機能で選ぶ</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              病棟の「本当のところ」を知って、選ぶ。
            </h2>
          </header>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={<Heart className="h-6 w-6" />}
              title="病棟レビュー"
              desc="人間関係・残業・お局の有無まで、現場のリアルな声を病棟単位で閲覧。ネガティブな情報も隠しません。"
              cta="レビューを見る"
              href="/search"
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="単発インターン"
              desc="タイミー感覚で、病棟の1日体験シフトに応募。看護助手として資格不要で現場を体験できます。"
              cta="体験枠を探す"
              href="/internships"
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="相性マッチング"
              desc="10問の価値観診断で、あなたに合う病棟をマッチ度スコアでレコメンド。配属ガチャを自分で回さない。"
              cta="診断を受ける"
              href="/matching"
            />
          </div>
        </section>

        {/* こんな悩みに */}
        <section className="bg-white py-16 md:py-24">
          <div className="container">
            <h2 className="text-center text-3xl font-black md:text-4xl">
              こんな不安、ありませんか？
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                { icon: <Users />, title: "人間関係って、実際どうなの？", body: "パンフには書いてない、病棟ごとの雰囲気・お局の有無・先輩の指導スタイル。" },
                { icon: <Clock />, title: "残業、本当にないの？", body: "月平均残業時間、残業代の有無、前残業の実態まで元職員が正直に回答。" },
                { icon: <AlertTriangle />, title: "配属先で全部決まるって本当？", body: "同じ病院でも病棟で全く違う。だから「病院」ではなく「病棟」で選ぶ。" },
                { icon: <CheckCircle2 />, title: "入ってみないと分からない？", body: "1日体験インターンで、実際に現場を見てから決められます。" },
              ].map((it, i) => (
                <div key={i} className="flex gap-4 rounded-2xl border border-black/5 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
                    {it.icon}
                  </div>
                  <div>
                    <h3 className="font-bold">{it.title}</h3>
                    <p className="mt-1 text-sm text-brand-navy/70">{it.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-16 md:py-24">
          <div className="rounded-3xl bg-gradient-to-br from-brand-pink to-[#ff5a98] p-10 text-center text-white md:p-16">
            <h2 className="text-3xl font-black md:text-4xl">
              まずは無料登録から。
            </h2>
            <p className="mt-3 text-white/90">
              学生・看護師は完全無料。登録30秒で、全病棟のレビューが読めます。
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-black text-brand-pink shadow-lg transition hover:scale-[1.02]"
            >
              無料で始める <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <TrustFooter />
      </main>
    </>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/10 p-4">
      <div className="flex items-center gap-2 text-brand-pink">{icon}</div>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs text-white/70">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="card flex flex-col">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-navy/70">{desc}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-pink hover:gap-2"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
