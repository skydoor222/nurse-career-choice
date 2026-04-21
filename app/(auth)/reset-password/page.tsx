"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowser } from "@/lib/supabase-client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const sb = createBrowser();
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="card-solid">
      <h1 className="text-display-md font-medium tracking-tight">
        パスワードリセット
      </h1>

      {sent ? (
        <div className="mt-6 rounded-xl bg-sage-200/50 p-4 text-sm text-sage-700">
          リセット用メールを送信しました。メール内のリンクから再設定してください。
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-muted">
            登録済みのメールアドレスを入力してください。再設定リンクをお送りします。
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="you@example.com"
            />
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "送信中..." : "リセットメールを送る"}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-bold text-coral-500">
          ログイン画面に戻る
        </Link>
      </p>
    </div>
  );
}
