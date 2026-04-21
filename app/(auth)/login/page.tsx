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
    <div className="card">
      <h1 className="text-2xl font-black">ログイン</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-bold">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/reset-password" className="text-brand-navy/70 hover:text-brand-pink">
          パスワードをお忘れの方
        </Link>
        <Link href="/register" className="font-bold text-brand-pink">
          新規登録
        </Link>
      </div>
    </div>
  );
}
