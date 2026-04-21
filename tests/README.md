# Tests

## ユニットテスト (Vitest)

```bash
npm test           # 1回実行
npm run test:watch # ファイル監視モード
```

`tests/unit/` 配下にあるテストは、純粋なロジック（`lib/matching.ts` `lib/queries.ts`）の検証。
Supabaseやネットワークは使いません。

## E2Eテスト (Playwright)

```bash
# 初回のみブラウザをインストール
npx playwright install chromium

# ローカルで実行（自動で `npm run dev` が起動されます）
npm run test:e2e

# UIモード（ブラウザで対話的に実行）
npm run test:e2e:ui

# 本番 or プレビュー環境に対して実行
E2E_BASE_URL=https://nurse-career-choice.vercel.app npm run test:e2e
```

`tests/e2e/` 配下には、認証不要で動作するスモークテストのみ置いています。
ログイン後のE2Eを追加する場合は、テスト用Supabaseユーザーを作成する仕組みが必要です。
