"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowser } from "@/lib/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const sb = createBrowser();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
      return;
    }
    router.push("/home");
    router.refresh();
  };

  return (
    <div className="card-solid">
      <h1 className="text-display-md font-medium tracking-tight">ログイン</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-ink-soft">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-ink-soft">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link
          href="/reset-password"
          className="text-ink-muted hover:text-ink"
        >
          パスワードをお忘れの方
        </Link>
        <Link
          href="/register"
          className="font-medium text-coral-500 hover:underline"
        >
          新規登録
        </Link>
      </div>
    </div>
  );
}
