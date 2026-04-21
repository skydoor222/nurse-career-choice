"use client";

import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Lock } from "lucide-react";

const PLACEHOLDERS = [
  {
    label: "ナースステーション",
    gradient: "from-[#FFB6C8] via-[#FF8CB5] to-[#FF5A9A]",
    caption: "チームで情報共有する中心地",
  },
  {
    label: "病棟廊下",
    gradient: "from-[#B5D9FF] via-[#7DB6F0] to-[#4D8CE0]",
    caption: "患者さんと会話する日常",
  },
  {
    label: "スタッフ休憩室",
    gradient: "from-[#C8EEC2] via-[#9FD798] to-[#73B96D]",
    caption: "ほっと一息つけるスペース",
  },
  {
    label: "処置室",
    gradient: "from-[#E6DAFF] via-[#BEA2F0] to-[#8E6EDE]",
    caption: "集中して作業する空間",
  },
];

export function WardPhotoPlaceholder() {
  const [i, setI] = useState(0);
  const current = PLACEHOLDERS[i];
  const next = () => setI((i + 1) % PLACEHOLDERS.length);
  const prev = () => setI((i - 1 + PLACEHOLDERS.length) % PLACEHOLDERS.length);

  return (
    <div className="card !p-0 overflow-hidden">
      <div
        className={`relative aspect-[16/9] bg-gradient-to-br ${current.gradient}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white/30 px-4 py-2 text-center backdrop-blur">
            <div className="flex items-center justify-center gap-1 text-sm font-black text-white drop-shadow">
              <Camera className="h-4 w-4" />
              {current.label}
            </div>
            <p className="mt-1 text-xs text-white/95">{current.caption}</p>
          </div>
        </div>

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
          <Lock className="h-3 w-3" />
          プライバシー保護のため加工表示
        </span>

        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-navy shadow backdrop-blur hover:bg-white"
          aria-label="前の写真"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-navy shadow backdrop-blur hover:bg-white"
          aria-label="次の写真"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {PLACEHOLDERS.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="px-4 py-3 text-[11px] leading-relaxed text-brand-navy/60">
        ※ 写真はプライバシー保護のためサンプル画像です。公開承諾を得た一部の病棟は実写真を掲載します。
      </p>
    </div>
  );
}
