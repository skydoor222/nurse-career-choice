import Link from "next/link";
import { Shield, Lock, Mail, Heart } from "lucide-react";

export function TrustFooter() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-pink text-white">
                N
              </span>
              <span className="text-brand-navy">NurseChoice</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-navy/70">
              看護学生・若手看護師のための「病棟単位」で選べる就職先選びサービス。
              配属ガチャに頼らない、新しい病院選びのスタンダードを目指しています。
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brand-navy/60">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700">
                <Lock className="h-3 w-3" />
                SSL暗号化通信
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-700">
                <Shield className="h-3 w-3" />
                匿名投稿対応
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-brand-navy">サービス</p>
            <ul className="mt-3 space-y-2 text-sm text-brand-navy/70">
              <li>
                <Link href="/search" className="hover:text-brand-pink">
                  病棟を探す
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-brand-pink">
                  単発インターン
                </Link>
              </li>
              <li>
                <Link href="/matching" className="hover:text-brand-pink">
                  相性マッチング
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold text-brand-navy">運営・法務</p>
            <ul className="mt-3 space-y-2 text-sm text-brand-navy/70">
              <li>
                <Link href="/about" className="hover:text-brand-pink">
                  運営会社情報
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-pink">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-pink">
                  利用規約
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@nursechoice.example.com"
                  className="inline-flex items-center gap-1 hover:text-brand-pink"
                >
                  <Mail className="h-3 w-3" />
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-black/5 pt-5 text-[11px] text-brand-navy/50 sm:flex-row">
          <p>© {new Date().getFullYear()} NurseChoice. All rights reserved.</p>
          <p className="inline-flex items-center gap-1">
            Made with <Heart className="h-3 w-3 fill-brand-pink text-brand-pink" /> for 看護学生
          </p>
        </div>
      </div>
    </footer>
  );
}
