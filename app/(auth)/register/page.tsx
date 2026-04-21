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
    <div className="card">
      <h1 className="text-2xl font-black">無料登録</h1>
      <p className="mt-2 text-sm text-brand-navy/70">
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
              className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                userType === o.value
                  ? "border-brand-pink bg-brand-pink/10 text-brand-pink"
                  : "border-black/10 bg-white text-brand-navy/70"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold">メールアドレス</label>
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
          <label className="mb-1 block text-xs font-bold">
            パスワード（8文字以上）
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
          <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "登録中..." : "無料で登録する"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-navy/70">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="font-bold text-brand-pink">
          ログイン
        </Link>
      </p>
    </div>
  );
}
