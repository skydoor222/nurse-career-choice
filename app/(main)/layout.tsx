import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";
import { TrustFooter } from "@/components/trust-footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 pb-24 pt-6 md:pb-10">{children}</main>
      <TrustFooter />
      <BottomNav />
    </div>
  );
}
