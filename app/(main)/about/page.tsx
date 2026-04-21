import { Heart, Target, Users } from "lucide-react";

export const metadata = {
  title: "運営会社情報 | NurseChoice",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl prose prose-sm">
      <h1 className="text-3xl font-medium tracking-tight">運営会社情報</h1>
      <p className="text-sm text-ink-muted">
        NurseChoice は、看護学生・若手看護師の「入ってみたら想像と違った」を減らすため、
        病棟単位のリアルな情報を提供する、独立系のキャリアプラットフォームです。
      </p>

      <div className="mt-8 grid gap-4">
        <Box icon={<Target className="h-5 w-5" />} title="ミッション">
          配属ガチャを自分で回せる社会をつくる。「病院」ではなく「病棟」単位で、
          透明で公正な情報流通を実現します。
        </Box>
        <Box icon={<Users className="h-5 w-5" />} title="運営方針">
          ネガティブな情報も含めて掲載します。特定の病院・団体からの広告掲載で
          掲載順位を操作することは一切ありません。
        </Box>
        <Box icon={<Heart className="h-5 w-5" />} title="レビューの信頼性">
          在籍/元職員の確認済みバッジを導入。職員証・シフト表など在籍確認書類の
          提出をもって付与します。書類は確認後ただちに削除します。
        </Box>
      </div>

      <h2 className="mt-10 text-xl font-medium tracking-tight">会社概要</h2>
      <dl className="mt-3 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
        <dt className="font-bold text-ink-muted">サービス名</dt>
        <dd>NurseChoice（ナースチョイス）</dd>
        <dt className="font-bold text-ink-muted">運営</dt>
        <dd>[要確認: 運営主体 — 法人名もしくは個人事業主名]</dd>
        <dt className="font-bold text-ink-muted">所在地</dt>
        <dd>[要確認: 所在地]</dd>
        <dt className="font-bold text-ink-muted">連絡先</dt>
        <dd>
          <a href="mailto:support@nursechoice.example.com" className="text-coral-500">
            support@nursechoice.example.com
          </a>
        </dd>
        <dt className="font-bold text-ink-muted">設立</dt>
        <dd>[要確認: 2026年]</dd>
      </dl>

      <p className="mt-8 rounded-lg bg-amber-50 p-4 text-xs text-amber-900">
        ※ 本ページはMVP公開用の暫定記載です。正式リリース時に運営主体情報・個人情報保護管理者・
        特定商取引法に基づく表記等を整備して公開します。
      </p>
    </div>
  );
}

function Box({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="not-prose flex gap-3 rounded-2xl border border-black/5 bg-white p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral-100 text-coral-500">
        {icon}
      </div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm text-ink-muted">{children}</p>
      </div>
    </div>
  );
}
