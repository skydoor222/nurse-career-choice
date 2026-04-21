"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowser } from "@/lib/supabase-client";
import { DEPARTMENTS, PREFECTURES } from "@/lib/utils";
import type { UserType } from "@/types";

export default function ProfileSetupPage() {
  const router = useRouter();
  const sb = createBrowser();
  const [userType, setUserType] = useState<UserType>("student");
  const [displayName, setDisplayName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [graduationYear, setGraduationYear] = useState<string>("");
  const [prefecture, setPrefecture] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: prof } = await sb
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (prof) {
        setUserType((prof.user_type as UserType) ?? "student");
        setDisplayName(prof.display_name ?? "");
        setSchoolName(prof.school_name ?? "");
        setGraduationYear(prof.graduation_year ? String(prof.graduation_year) : "");
        setPrefecture(prof.preferred_prefecture ?? "");
        setDepartments(
          prof.preferred_department ? prof.preferred_department.split(",") : []
        );
      }
    })();
  }, [sb, router]);

  const toggleDept = (d: string) => {
    setDepartments((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { error } = await sb
      .from("user_profiles")
      .upsert({
        id: user.id,
        user_type: userType,
        display_name: displayName,
        school_name: userType === "student" ? schoolName : null,
        graduation_year:
          userType === "student" && graduationYear ? Number(graduationYear) : null,
        preferred_prefecture: prefecture || null,
        preferred_department: departments.length ? departments.join(",") : null,
      });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/home");
    router.refresh();
  };

  const yearNow = new Date().getFullYear();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-black">プロフィール設定</h1>
      <p className="mt-2 text-sm text-brand-navy/70">
        あなたに合った病棟をおすすめするために、少しだけ教えてください。
      </p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <Field label="表示名">
          <input
            className="input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            maxLength={40}
          />
        </Field>

        {userType === "student" && (
          <>
            <Field label="学校名">
              <input
                className="input"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </Field>
            <Field label="卒業予定年">
              <select
                className="input"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
              >
                <option value="">選択してください</option>
                {[0, 1, 2, 3, 4].map((i) => {
                  const y = yearNow + i;
                  return (
                    <option key={y} value={y}>
                      {y}年
                    </option>
                  );
                })}
              </select>
            </Field>
          </>
        )}

        <Field label="希望エリア（都道府県）">
          <select
            className="input"
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field label="興味のある診療科（複数選択可）">
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDept(d)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  departments.includes(d)
                    ? "border-brand-pink bg-brand-pink text-white"
                    : "border-black/10 bg-white text-brand-navy/70"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </Field>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "保存中..." : "保存してはじめる"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold">{label}</span>
      {children}
    </label>
  );
}
