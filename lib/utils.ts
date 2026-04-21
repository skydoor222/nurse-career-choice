import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function formatTime(t: string) {
  return t.slice(0, 5);
}

export const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

export const DEPARTMENTS = [
  "内科","外科","循環器","呼吸器","消化器","脳神経外科","整形外科",
  "ICU","救急","産科","婦人科","小児科","精神科","皮膚科","眼科",
  "耳鼻咽喉科","泌尿器科","緩和ケア","透析","手術室","外来","その他",
];

export const HOSPITAL_TYPES = [
  "大学病院","総合病院","一般病院","クリニック","療養型","精神科病院",
];
