import Link from "next/link";
import { createServer } from "@/lib/supabase";

export async function SiteHeader() {
  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href={user ? "/home" : "/"} className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-pink text-white">
            N
          </span>
          <span className="text-brand-navy">NurseChoice</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-bold md:flex">
          <Link href="/search" className="text-brand-navy/70 hover:text-brand-navy">
            病棟を探す
          </Link>
          <Link href="/internships" className="text-brand-navy/70 hover:text-brand-navy">
            単発体験
          </Link>
          <Link href="/matching" className="text-brand-navy/70 hover:text-brand-navy">
            相性診断
          </Link>
          {user ? (
            <Link href="/mypage" className="btn-primary px-4 py-2 text-sm">
              マイページ
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-brand-navy/70 hover:text-brand-navy">
                ログイン
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2 text-sm">
                無料登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
