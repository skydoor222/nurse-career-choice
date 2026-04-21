import { test, expect } from "@playwright/test";

test.describe("LP (ランディングページ)", () => {
  test("キャッチコピーが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /配属ガチャ/ })
    ).toBeVisible();
  });

  test("3機能カードが全て表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("病棟レビュー").first()).toBeVisible();
    await expect(page.getByText("単発インターン").first()).toBeVisible();
    await expect(page.getByText("相性マッチング").first()).toBeVisible();
  });

  test("「無料で始める」ボタンが登録ページに遷移する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /無料で始める/ }).first().click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("トラストフッターに法務リンクが表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "プライバシーポリシー" }).scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("link", { name: "プライバシーポリシー" })
    ).toBeVisible();
  });
});

test.describe("認証ページ", () => {
  test("ログインページが表示される", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
  });

  test("登録ページが表示される", async ({ page }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: "無料登録" })
    ).toBeVisible();
    // 属性選択ボタンがある
    await expect(page.getByText("看護学生")).toBeVisible();
    await expect(page.getByText("看護師（転職検討）")).toBeVisible();
  });

  test("パスワード8文字未満は登録拒否される", async ({ page }) => {
    await page.goto("/register");
    await page
      .getByPlaceholder("you@example.com")
      .fill("test@example.com");
    await page.locator('input[type="password"]').fill("short");
    await page.getByRole("button", { name: /無料で登録する/ }).click();
    await expect(page.getByText(/8文字以上/)).toBeVisible();
  });
});

test.describe("法務ページ", () => {
  test("プライバシーポリシーが表示される", async ({ page }) => {
    await page.goto("/privacy");
    await expect(
      page.getByRole("heading", { name: "プライバシーポリシー" })
    ).toBeVisible();
  });

  test("利用規約が表示される", async ({ page }) => {
    await page.goto("/terms");
    await expect(
      page.getByRole("heading", { name: "利用規約" })
    ).toBeVisible();
  });

  test("運営会社情報が表示される", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "運営会社情報" })
    ).toBeVisible();
  });
});

test.describe("認証未ログイン時のリダイレクト", () => {
  test("/home はログインにリダイレクトされる", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/mypage はログインにリダイレクトされる", async ({ page }) => {
    await page.goto("/mypage");
    await expect(page).toHaveURL(/\/login/);
  });
});
