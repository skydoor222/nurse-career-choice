import Link from "next/link";
import { Lock, ShieldCheck, Mail } from "lucide-react";

export function TrustFooter() {
  return (
    <footer className="border-t border-hairline bg-white/40">
      <div className="container py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-ink text-canvas">
                <span className="font-display text-[18px] italic leading-none">
                  N
                </span>
              </span>
              <span className="text-[15px] font-medium">NurseChoice</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-muted">
              看護学生・若手看護師のための、
              <br className="hidden md:block" />
              病棟単位で選べる就職先選びプラットフォーム。
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-200/50 px-2.5 py-1 text-[11px] font-medium text-sage-700">
                <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                SSL暗号化
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-200/50 px-2.5 py-1 text-[11px] font-medium text-sage-700">
                <Lock className="h-3 w-3" strokeWidth={2} />
                匿名投稿対応
              </span>
            </div>
          </div>

          <FooterCol
            className="md:col-span-3"
            title="サービス"
            links={[
              { href: "/search", label: "病棟を探す" },
              { href: "/internships", label: "単発インターン" },
              { href: "/matching", label: "相性マッチング" },
            ]}
          />

          <FooterCol
            className="md:col-span-4"
            title="運営・法務"
            links={[
              { href: "/about", label: "運営会社情報" },
              { href: "/privacy", label: "プライバシーポリシー" },
              { href: "/terms", label: "利用規約" },
            ]}
          >
            <a
              href="mailto:support@nursechoice.example.com"
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
              support@nursechoice.example.com
            </a>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-8 text-[11px] text-ink-muted md:flex-row">
          <p>© {new Date().getFullYear()} NurseChoice. All rights reserved.</p>
          <p className="font-display italic">
            Made with care for 看護学生.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  className = "",
  title,
  links,
  children,
}: {
  className?: string;
  title: string;
  links: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-[14px]">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-ink-muted transition hover:text-ink"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}
