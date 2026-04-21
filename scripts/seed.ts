/**
 * Seed script — populates hospitals, wards, reviews, internships.
 *
 * Usage:
 *   1. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   2. Run: npm run seed
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env."
  );
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const HOSPITALS = [
  {
    name: "東都大学医学部附属病院",
    address: "文京区本郷 1-2-3",
    prefecture: "東京都",
    hospital_type: "大学病院",
    bed_count: 1050,
    description:
      "都心部の大学病院。急性期医療の中核として幅広い診療科を備える。新人教育プログラムが充実。",
  },
  {
    name: "みなとグリーン総合病院",
    address: "港区芝浦 4-5-6",
    prefecture: "東京都",
    hospital_type: "総合病院",
    bed_count: 420,
    description:
      "地域密着型の総合病院。内科・外科を中心にバランスの取れた病棟構成。",
  },
  {
    name: "神奈川中央病院",
    address: "横浜市西区みなとみらい 2-3-4",
    prefecture: "神奈川県",
    hospital_type: "総合病院",
    bed_count: 580,
    description:
      "救急指定病院。ICUを含む高度医療と、ワークライフバランスの両立に力を入れる。",
  },
  {
    name: "大阪あおぞら病院",
    address: "大阪市中央区本町 5-6-7",
    prefecture: "大阪府",
    hospital_type: "総合病院",
    bed_count: 380,
    description:
      "小児科・産科に強みを持つ地域中核病院。スタッフの定着率が高いのが特徴。",
  },
  {
    name: "さくらクリニック",
    address: "世田谷区三軒茶屋 1-1-1",
    prefecture: "東京都",
    hospital_type: "クリニック",
    bed_count: 19,
    description:
      "外来中心の有床クリニック。少人数で風通しの良い職場。日勤中心で残業がほぼない。",
  },
];

const WARD_TEMPLATES: Record<
  string,
  { name: string; department: string; staff_count: number; description: string }[]
> = {
  大学病院: [
    { name: "3階内科病棟", department: "内科", staff_count: 42, description: "消化器・呼吸器内科の混合病棟。教育プログラム充実。" },
    { name: "5階ICU", department: "ICU", staff_count: 38, description: "術後管理・重症患者対応の集中治療室。" },
    { name: "6階外科病棟", department: "外科", staff_count: 45, description: "消化器外科を中心とした術後管理。夜勤あり。" },
    { name: "8階小児科病棟", department: "小児科", staff_count: 32, description: "小児専門病棟。家族ケアも重視。" },
    { name: "救命救急センター", department: "救急", staff_count: 50, description: "三次救急。変則勤務あり。手当厚め。" },
  ],
  総合病院: [
    { name: "4階内科病棟", department: "内科", staff_count: 28, description: "慢性期寄りの内科病棟。比較的ゆったりした勤務。" },
    { name: "5階外科病棟", department: "外科", staff_count: 30, description: "消化器・整形混合。術後管理が中心。" },
    { name: "7階産科病棟", department: "産科", staff_count: 24, description: "分娩・産褥ケア。母子同室対応。" },
    { name: "ICU", department: "ICU", staff_count: 22, description: "外科・内科の重症患者対応。" },
  ],
  クリニック: [
    { name: "外来部門", department: "外来", staff_count: 8, description: "日勤のみ。土日祝休み中心。" },
    { name: "1階有床病棟", department: "内科", staff_count: 10, description: "有床診療所の病棟。少人数でアットホーム。" },
  ],
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

const REVIEW_BODIES = {
  positive: [
    "先輩が丁寧にフォローしてくれるので、新卒でも安心して業務に入れます。人間関係は良好で、プリセプター制度も機能していました。",
    "忙しい病棟ですが、スタッフ同士の連携が強く、悩みを相談しやすい雰囲気です。残業代もきちんと支払われます。",
    "研修・勉強会が多く、専門性を高めたい人に向いています。先輩からの声かけも多く、孤立しにくい環境です。",
    "ワークライフバランスは比較的取りやすく、希望休も通りやすいです。有給も取りやすい雰囲気。",
  ],
  negative: [
    "独特の空気感があり、特定の先輩に気を遣う必要があります。合う合わないが分かれる病棟だと感じました。",
    "残業が慢性的で、前残業も実質必須。記録業務が多く、時間外に持ち越すことが多いです。",
    "教育体制は整っているとは言えず、最初の数ヶ月は自分で調べて動く必要があります。",
    "スタッフ間のギスギスした空気があり、新人は特に緊張が続きます。配属されたら覚悟が必要です。",
  ],
  neutral: [
    "普通の職場です。良くも悪くも特別なことはなく、標準的な業務内容と教育を受けられます。",
    "病棟によって雰囲気が大きく異なるので、見学やインターンで確かめることをおすすめします。",
  ],
};

async function run() {
  console.log("▶ Seeding hospitals...");

  const { error: delErr } = await sb
    .from("bookings")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  // optional: clean older seed data (best-effort)
  await sb.from("favorites").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("internships").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("wards").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("hospitals").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const { data: insertedHospitals, error: hErr } = await sb
    .from("hospitals")
    .insert(HOSPITALS)
    .select();
  if (hErr) throw hErr;
  console.log(`  + ${insertedHospitals!.length} hospitals`);

  const allWards: any[] = [];
  for (const hospital of insertedHospitals!) {
    const templates = WARD_TEMPLATES[hospital.hospital_type] ?? WARD_TEMPLATES["総合病院"];
    const wardsToInsert = templates.map((t) => ({
      hospital_id: hospital.id,
      ...t,
    }));
    const { data: wards, error: wErr } = await sb
      .from("wards")
      .insert(wardsToInsert)
      .select();
    if (wErr) throw wErr;
    allWards.push(...wards!);
  }
  console.log(`  + ${allWards.length} wards`);

  console.log("▶ Seeding reviews...");
  let reviewsTotal = 0;
  for (const w of allWards) {
    const n = randomInt(3, 8);
    const rows = Array.from({ length: n }).map(() => {
      const isPositive = Math.random() > 0.45;
      const isHarsh = !isPositive && Math.random() > 0.5;
      const human = isPositive ? randomInt(4, 5) : isHarsh ? randomInt(1, 2) : randomInt(2, 4);
      const busy = w.department === "ICU" || w.department === "救急" ? randomInt(4, 5) : randomInt(2, 5);
      const edu = isPositive ? randomInt(3, 5) : randomInt(2, 4);
      const wlb = isPositive ? randomInt(3, 5) : randomInt(1, 3);
      const overtime =
        busy >= 4 ? randomInt(25, 55) : busy === 3 ? randomInt(10, 25) : randomInt(2, 12);
      const paid = Math.random() > 0.2;
      const pre = Math.random() > (w.department === "外来" ? 0.9 : 0.55);
      const hasDiff = isHarsh || Math.random() > 0.7;
      const pool = isPositive
        ? REVIEW_BODIES.positive
        : isHarsh
        ? REVIEW_BODIES.negative
        : REVIEW_BODIES.neutral;
      return {
        ward_id: w.id,
        author_year: pick([1, 1, 2, 3, 3, 5]),
        is_current_staff: Math.random() > 0.3,
        score_human_relations: human,
        score_busyness: busy,
        score_education: edu,
        score_work_life: wlb,
        overtime_avg: overtime,
        overtime_paid: paid,
        pre_overtime: pre,
        has_difficult_person: hasDiff,
        body: pick(pool),
      };
    });
    const { error } = await sb.from("reviews").insert(rows);
    if (error) throw error;
    reviewsTotal += rows.length;
  }
  console.log(`  + ${reviewsTotal} reviews`);

  console.log("▶ Seeding internships...");
  const internshipRows: any[] = [];
  const wardsForIntern = [...allWards].sort(() => Math.random() - 0.5).slice(0, 10);
  const today = new Date();
  for (let i = 0; i < wardsForIntern.length; i++) {
    const w = wardsForIntern[i];
    const d = new Date(today);
    d.setDate(today.getDate() + randomInt(3, 55));
    const dateStr = d.toISOString().slice(0, 10);
    const startHour = pick([8, 9, 13]);
    const cap = randomInt(1, 3);
    internshipRows.push({
      ward_id: w.id,
      date: dateStr,
      start_time: `${String(startHour).padStart(2, "0")}:00:00`,
      end_time: `${String(startHour + 4).padStart(2, "0")}:00:00`,
      capacity: cap,
      remaining: cap,
      description:
        "看護助手として、シーツ交換・環境整備・配膳補助などをお願いします。医療行為はありません。学生バイト感覚で参加OK、履歴書不要・面接なし。終わった後に看護師さんと休憩室でゆっくり話せる時間もあります。",
      is_active: true,
    });
  }
  const { error: iErr } = await sb.from("internships").insert(internshipRows);
  if (iErr) throw iErr;
  console.log(`  + ${internshipRows.length} internships`);

  console.log("✓ Seed complete");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
