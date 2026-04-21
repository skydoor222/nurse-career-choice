import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg to-white">
      <header className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-pink text-white">
            N
          </span>
          <span className="text-brand-navy">NurseChoice</span>
        </Link>
      </header>
      <main className="container grid min-h-[calc(100vh-56px)] place-items-center py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
