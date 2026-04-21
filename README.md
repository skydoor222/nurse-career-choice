# NurseChoice — MVP

看護学生・若手看護師が「病棟単位」で就職先を選べるWebサービスのMVP実装。

- **病棟レビュー** — 人間関係・残業・お局など現場のリアルを部署単位で閲覧
- **単発インターン** — タイミー感覚で病棟の1日体験シフトに応募（看護助手、資格不要）
- **相性マッチング** — 10問の価値観診断で合う病棟をマッチ度スコアで提案

---

## 技術スタック

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth / Database)
- Vercel デプロイ想定

## セットアップ手順

### 1. 依存をインストール

```bash
npm install
```

### 2. Supabase プロジェクトを準備

1. [supabase.com](https://supabase.com/) で新規プロジェクトを作成
2. SQL Editor で `supabase/schema.sql` を実行してテーブル・RLSポリシーを作成
3. Project Settings → API から以下をコピー

### 3. 環境変数を設定

プロジェクトルートに `.env.local` を作成。

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. ダミーデータを投入

```bash
npm run seed
```

- 病院: 5件（大学病院1 / 総合病院3 / クリニック1）
- 病棟: 各3〜5病棟（計17〜20病棟）
- レビュー: 各3〜8件（計50〜100件）
- インターン枠: 10件（今日〜2ヶ月先）

### 5. 開発サーバー起動

```bash
npm run dev
```

→ http://localhost:3000

---

## ディレクトリ構成

```
app/
  (auth)/            ログイン・登録・パスワードリセット
  (main)/            認証後の主画面群
    home/            ホーム
    search/          病棟検索
    hospitals/[id]/  病院詳細
    wards/[id]/      病棟詳細・レビュー
    internships/     インターン一覧・詳細・応募・完了
    matching/        10問診断・結果
    mypage/          予約履歴・お気に入り・診断履歴（タブ）
    notifications/   通知
    profile/setup/   プロフィール設定
  page.tsx           LP
components/          WardCard, ReviewCard, ScoreBadge, BottomNav, 等
lib/
  supabase.ts        Supabase ブラウザ/サーバークライアント
  queries.ts         病棟・レビュー・インターンのクエリ
  matching.ts        10問の設問 + マッチ度計算
  utils.ts           cn / 日付フォーマット / 都道府県マスタ 等
supabase/
  schema.sql         テーブル定義 + RLS ポリシー
scripts/
  seed.ts            ダミーデータ投入
types/               型定義
```

---

## 実装メモ

### UI / UX ポリシー

- **ネガティブなレビューは非表示にしない** — ユーザーが最も求めている情報。レビュー詳細でも「お局・問題人物の割合」を明示。
- **人間関係スコアを最上位** — 病棟詳細のスコアサマリーで常に最初に大きく表示。
- **残業代・前残業はバッジで一目でわかる** — 病棟カードでもレビュー詳細でもバッジ化。

### マッチング計算

`lib/matching.ts` の `computeUserPreference` → `computeMatchScore` で 0-100 のスコアを出す。

- 人間関係・教育・WLB: 病棟の5段階スコアを正規化して重み付け
- 忙しさ: ユーザーの残業許容度 (1=嫌 〜 5=気にしない) と病棟の忙しさのギャップ
- 残業時間: 許容時間を超えた分だけ減点
- 残業代ありボーナス / 前残業ペナルティ / お局ペナルティ
- 希望診療科マッチでボーナス加点

### 実装スコープ外（要件どおり）

- 病院管理者ポータル（データはSupabase管理画面から手動投入）
- レビュー投稿 / 修正機能
- インターン枠の承認・却下UI（Supabase管理画面で `bookings.status` を更新）
- 決済
- SNSログイン / チャット

---

## デプロイ（Vercel）

1. このリポジトリを GitHub にpush
2. Vercel で import
3. 環境変数 3つ (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) を設定
4. Supabase Auth の Redirect URLs に本番ドメインを追加
