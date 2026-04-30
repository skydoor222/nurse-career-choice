"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { RefreshCw } from "lucide-react";
import { createBrowser } from "@/lib/supabase-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="card-solid">
      <div className="h-9 w-32 animate-pulse rounded bg-ink/10" />
      <div className="mt-6 space-y-4">
        <div className="h-12 animate-pulse rounded-2xl bg-ink/5" />
        <div className="h-12 animate-pulse rounded-2xl bg-ink/5" />
      </div>
    </div>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSwitching = searchParams.get("switch") === "1";
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
      <h1 className="text-display-md font-medium tracking-tight">
        {isSwitching ? "別アカウントでログイン" : "ログイン"}
      </h1>
      {isSwitching && (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-coral-50 px-3 py-1.5 text-[11px] font-medium text-coral-500">
          <RefreshCw className="h-3 w-3" />
          以前のアカウントからサインアウトしました
        </p>
      )}
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
