import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container pb-24 pt-6 md:pb-10">{children}</main>
      <BottomNav />
    </div>
  );
}
