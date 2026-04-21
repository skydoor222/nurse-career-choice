import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NurseChoice — 配属ガチャに、もう、頼らない。",
  description:
    "病棟単位で人間関係・残業・職場の雰囲気がわかる。看護学生・若手看護師のための、病棟レビュー × 単発インターン × 相性マッチング。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-brand-bg text-brand-navy antialiased">
        {children}
      </body>
    </html>
  );
}
