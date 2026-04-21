import type { Metadata } from "next";
import { Instrument_Serif, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display-en",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display-jp",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NurseChoice — 配属ガチャに、もう、頼らない。",
  description:
    "病棟単位で人間関係・残業・職場の雰囲気がわかる。看護学生・若手看護師のための、病棟レビュー × 単発インターン × 相性マッチング。",
  openGraph: {
    title: "NurseChoice",
    description: "配属ガチャに、もう、頼らない。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${instrumentSerif.variable} ${notoSerifJp.variable} ${notoSansJp.variable}`}
    >
      <body className="min-h-screen bg-canvas text-ink">{children}</body>
    </html>
  );
}
