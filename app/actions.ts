"use server";

import { createServer } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const sb = createServer();
  await sb.auth.signOut();
  redirect("/login");
}

export async function switchAccountAction() {
  const sb = createServer();
  await sb.auth.signOut();
  redirect("/login?switch=1");
}

export async function toggleFavorite(wardId: string, favorite: boolean) {
  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "未ログイン" };

  if (favorite) {
    await sb.from("favorites").upsert(
      { user_id: user.id, ward_id: wardId },
      { onConflict: "user_id,ward_id" }
    );
  } else {
    await sb.from("favorites").delete().eq("user_id", user.id).eq("ward_id", wardId);
  }
  revalidatePath(`/wards/${wardId}`);
  revalidatePath("/mypage");
  return { ok: true };
}
