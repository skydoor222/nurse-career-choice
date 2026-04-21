import Link from "next/link";
import { createServer } from "@/lib/supabase";

export async function SiteHeader() {
  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href={user ? "/home" : "/"}
          className="flex items-center gap-2.5 font-medium tracking-tight"
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-2xl bg-ink text-canvas">
            <span className="font-display text-[16px] italic leading-none">N</span>
          </span>
          <span className="text-[15px] font-medium tracking-tight text-ink">
            NurseChoice
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          <HeaderLink href="/search">病棟</HeaderLink>
          <HeaderLink href="/internships">1日体験</HeaderLink>
          <HeaderLink href="/matching">相性診断</HeaderLink>
          <span className="mx-2 h-6 w-px bg-hairline" />
          {user ? (
            <Link
              href="/mypage"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-canvas transition hover:bg-ink/90"
            >
              マイページ
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-ink-muted hover:text-ink"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-canvas transition hover:bg-ink/90"
              >
                無料で始める
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium text-ink-muted transition hover:bg-ink/5 hover:text-ink"
    >
      {children}
    </Link>
  );
}
