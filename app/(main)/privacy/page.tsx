export const metadata = { title: "プライバシーポリシー | NurseChoice" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl prose prose-sm">
      <h1 className="text-3xl font-black">プライバシーポリシー</h1>
      <p className="text-xs text-brand-navy/60">最終更新: 2026-04-22</p>

      <p>
        NurseChoice（以下「当サービス」）は、利用者のプライバシーを最重要視し、
        以下の方針で個人情報を取り扱います。
      </p>

      <h2>1. 取得する情報</h2>
      <ul>
        <li>メールアドレス・パスワード（認証用）</li>
        <li>表示名・学校名・卒業予定年（任意項目）</li>
        <li>希望エリア・興味のある診療科（マッチング用）</li>
        <li>インターン応募内容・お気に入り・診断結果</li>
        <li>Cookie/IPアドレス（不正利用防止・最小限）</li>
      </ul>

      <h2>2. 利用目的</h2>
      <ul>
        <li>サービス提供・マッチング結果の算出</li>
        <li>インターン応募の病院側への取次</li>
        <li>サービス改善・統計的分析（個人を特定しない形で）</li>
      </ul>

      <h2>3. 第三者提供</h2>
      <p>
        インターン応募時、応募先病院に必要最小限の情報（氏名・学校名・志望動機）を提供します。
        それ以外の第三者提供・広告目的での提供は行いません。
      </p>

      <h2>4. レビュー投稿の匿名性</h2>
      <p>
        レビュー投稿者の身元は、当サービスを含め第三者に開示しません。
        在籍確認書類は照合後ただちに削除します。
      </p>

      <h2>5. データの保存期間・削除</h2>
      <p>
        退会リクエストがあった場合、30日以内に全ての個人情報を削除します。
        投稿されたレビュー本文は、匿名性を保った状態で保持する場合があります。
      </p>

      <h2>6. お問い合わせ</h2>
      <p>
        <a href="mailto:support@nursechoice.example.com" className="text-brand-pink">
          support@nursechoice.example.com
        </a>
      </p>

      <p className="mt-8 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 not-prose">
        ※ MVP公開用の暫定記載です。正式リリース時に個人情報保護委員会の指針に沿い、
        個人情報保護管理者・第三者提供先の一覧・開示請求手続きを整備します。
      </p>
    </div>
  );
}
