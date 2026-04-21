"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowser } from "@/lib/supabase-client";
import type { UserType } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("メールアドレスの形式が正しくありません");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }
    setLoading(true);
    const sb = createBrowser();
    const { data, error: signErr } = await sb.auth.signUp({
      email,
      password,
      options: { data: { user_type: userType } },
    });
    if (signErr) {
      setError(signErr.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await sb.from("user_profiles").upsert({
        id: data.user.id,
        user_type: userType,
      });
    }
    router.push("/profile/setup");
    router.refresh();
  };

  return (
    <div className="card-solid">
      <h1 className="text-display-md font-medium tracking-tight">
        無料登録
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        学生・看護師は完全無料。登録30秒で全レビューが読めます。
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "student", label: "看護学生" },
            { value: "nurse", label: "看護師（転職検討）" },
          ].map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setUserType(o.value as UserType)}
              className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                userType === o.value
                  ? "border-ink bg-ink text-canvas"
                  : "border-hairline bg-white text-ink-muted hover:border-ink/30 hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

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
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-ink-soft">
            パスワード (8文字以上)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="input"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "登録中..." : "無料で登録する"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="font-medium text-coral-500 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
