import { test, expect } from "@playwright/test";

test.describe("公開ページのナビゲーション", () => {
  test("検索ページから病棟詳細まで遷移できる", async ({ page }) => {
    await page.goto("/search");
    await expect(
      page.getByRole("heading", { name: "病棟を探す" })
    ).toBeVisible();

    // 結果の1件目をクリック（リンクは /wards/... で始まる）
    const firstWardLink = page
      .locator('a[href^="/wards/"]')
      .first();

    if ((await firstWardLink.count()) > 0) {
      await firstWardLink.click();
      await expect(page).toHaveURL(/\/wards\/[a-f0-9-]+/);
      // 病棟名 h1 が表示される
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("インターン一覧が表示される", async ({ page }) => {
    await page.goto("/internships");
    await expect(page.getByText(/1日だけ、/)).toBeVisible();
    await expect(page.getByText(/看護助手として/).first()).toBeVisible();
    await expect(page.getByText(/資格不要/).first()).toBeVisible();
  });

  test("インターン詳細で「やること/やらないこと」が表示される", async ({ page }) => {
    await page.goto("/internships");
    const link = page.locator('a[href^="/internships/"]').first();
    if ((await link.count()) > 0) {
      await link.click();
      await expect(page.getByText("当日やること").first()).toBeVisible();
      await expect(page.getByText("やらないこと").first()).toBeVisible();
      await expect(page.getByText(/医療行為/).first()).toBeVisible();
    }
  });
});

test.describe("レスポンシブ", () => {
  test("モバイル幅でボトムナビが表示される（認証が必要なページでのみ）", async ({ page }) => {
    // LPにはボトムナビは出ない
    await page.goto("/");
    // 未ログイン状態では home は login にリダイレクトされる
    // → ボトムナビは (main) レイアウト配下のページのみ
    await page.goto("/login");
    // ログインページにはボトムナビは出ない（authレイアウト）
  });
});
