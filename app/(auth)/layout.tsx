import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="noise-overlay relative min-h-screen">
      <div className="orb left-[-10%] top-[5%] h-[320px] w-[320px] bg-coral-300 opacity-30" />
      <div className="orb right-[-10%] bottom-[5%] h-[340px] w-[340px] bg-plum-300 opacity-30" />
      <header className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2.5 font-medium">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-ink text-canvas">
            <span className="font-display text-[16px] italic leading-none">
              N
            </span>
          </span>
          <span className="text-[15px] text-ink">NurseChoice</span>
        </Link>
      </header>
      <main className="container grid min-h-[calc(100vh-64px)] place-items-center py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
