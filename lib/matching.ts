import type { MatchingAnswer, MatchingScores, WardSummary } from "@/types";

export interface Question {
  id: number;
  text: string;
  options: { value: string; label: string }[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "職場で一番大切にしたいことは？",
    options: [
      { value: "relations", label: "人間関係" },
      { value: "growth", label: "成長" },
      { value: "stability", label: "安定" },
      { value: "wlb", label: "ワークライフバランス" },
    ],
  },
  {
    id: 2,
    text: "残業はどのくらいなら許容できる？",
    options: [
      { value: "none", label: "ほぼなし" },
      { value: "10h", label: "月10h程度" },
      { value: "20h", label: "月20h程度" },
      { value: "any", label: "気にしない" },
    ],
  },
  {
    id: 3,
    text: "職場の雰囲気として合うのは？",
    options: [
      { value: "home", label: "アットホーム" },
      { value: "pro", label: "プロフェッショナル" },
      { value: "active", label: "活気がある" },
      { value: "quiet", label: "静か" },
    ],
  },
  {
    id: 4,
    text: "急性期と慢性期、どちらが向いてる？",
    options: [
      { value: "acute", label: "急性期" },
      { value: "chronic", label: "慢性期" },
      { value: "unknown", label: "わからない" },
      { value: "either", label: "どちらでも" },
    ],
  },
  {
    id: 5,
    text: "先輩からの指導スタイルは？",
    options: [
      { value: "strict", label: "厳しくても丁寧に" },
      { value: "kind", label: "優しく教えてほしい" },
      { value: "self", label: "自分で学びたい" },
      { value: "either", label: "どちらでも" },
    ],
  },
  {
    id: 6,
    text: "同僚との関係はどうありたい？",
    options: [
      { value: "close", label: "仲良く飲みに行く" },
      { value: "team", label: "仕事上の仲間として" },
      { value: "distance", label: "適度な距離" },
      { value: "either", label: "どちらでも" },
    ],
  },
  {
    id: 7,
    text: "給料と働きやすさ、優先するのは？",
    options: [
      { value: "salary", label: "給料" },
      { value: "wlb", label: "働きやすさ" },
      { value: "both", label: "どちらも同じくらい" },
      { value: "other", label: "その他" },
    ],
  },
  {
    id: 8,
    text: "休日は確実に取れることが重要？",
    options: [
      { value: "very", label: "非常に重要" },
      { value: "important", label: "重要" },
      { value: "either", label: "どちらでも" },
      { value: "no", label: "気にしない" },
    ],
  },
  {
    id: 9,
    text: "チームで動くのと個人で動くの、どちらが好き？",
    options: [
      { value: "team", label: "チーム" },
      { value: "individual", label: "個人" },
      { value: "either", label: "どちらでも" },
    ],
  },
  {
    id: 10,
    text: "将来的に専門性を高めたい診療科は？",
    options: [
      { value: "acute", label: "急性期・救急" },
      { value: "surgical", label: "外科系" },
      { value: "internal", label: "内科系" },
      { value: "ped_ob", label: "小児・産科" },
      { value: "undecided", label: "まだ決まってない" },
    ],
  },
];

export function computeUserPreference(
  answers: MatchingAnswer[]
): MatchingScores & { preferred_department?: string[] } {
  const map = new Map(answers.map((a) => [a.questionId, a.value]));
  let human = 3,
    busy = 3,
    edu = 3,
    wlb = 3,
    overtimeTol = 3;

  // Q1 重視軸
  switch (map.get(1)) {
    case "relations":
      human += 2;
      break;
    case "growth":
      edu += 2;
      break;
    case "stability":
      wlb += 1;
      break;
    case "wlb":
      wlb += 2;
      break;
  }

  // Q2 残業許容度 (高いほど忙しい職場でも許容)
  switch (map.get(2)) {
    case "none":
      overtimeTol = 1;
      break;
    case "10h":
      overtimeTol = 2;
      break;
    case "20h":
      overtimeTol = 3;
      break;
    case "any":
      overtimeTol = 5;
      break;
  }

  // Q3 雰囲気
  if (map.get(3) === "home" || map.get(3) === "quiet") human += 1;
  if (map.get(3) === "active") busy += 1;

  // Q5 指導スタイル
  if (map.get(5) === "strict" || map.get(5) === "kind") edu += 1;

  // Q6 同僚関係
  if (map.get(6) === "close") human += 1;

  // Q7 給料 vs 働きやすさ
  if (map.get(7) === "wlb") wlb += 1;

  // Q8 休日
  if (map.get(8) === "very") wlb += 2;
  else if (map.get(8) === "important") wlb += 1;

  // Q10 診療科
  const q10 = map.get(10);
  const deptMap: Record<string, string[]> = {
    acute: ["ICU", "救急", "循環器", "脳神経外科"],
    surgical: ["外科", "整形外科", "脳神経外科", "手術室"],
    internal: ["内科", "循環器", "呼吸器", "消化器"],
    ped_ob: ["小児科", "産科", "婦人科"],
  };
  const preferred_department = q10 ? deptMap[q10] : undefined;

  const clamp = (v: number) => Math.min(5, Math.max(1, v));
  return {
    human_relations: clamp(human),
    busyness: clamp(busy),
    education: clamp(edu),
    work_life: clamp(wlb),
    overtime_tolerance: overtimeTol,
    preferred_department,
  };
}

// 0-100 のマッチ度を返す
export function computeMatchScore(
  pref: ReturnType<typeof computeUserPreference>,
  ward: WardSummary
): number {
  if (ward.review_count === 0) return 0;

  // 人間関係: ward.avg_human_relations をそのまま評価（高いほど良い）が、
  // ユーザーが人間関係重視(pref.human_relations>=4)なら重みを倍に。
  const weightHuman = pref.human_relations >= 4 ? 2.5 : 1.5;
  const weightEdu = pref.education >= 4 ? 2.0 : 1.0;
  const weightWlb = pref.work_life >= 4 ? 2.0 : 1.0;

  // スコア正規化: 病棟の5段階スコア / 5 → 0〜1
  const sHuman = ward.avg_human_relations / 5;
  const sEdu = ward.avg_education / 5;
  const sWlb = ward.avg_work_life / 5;

  // 忙しさ: ユーザーの許容度(1=残業嫌, 5=気にしない)と病棟の忙しさ(1-5)の一致度
  const busyGap = Math.abs(ward.avg_busyness - pref.overtime_tolerance);
  const sBusy = 1 - busyGap / 4; // 0〜1

  // 残業時間: 許容度に応じた許容月残業 (hours)
  const tolMap: Record<number, number> = { 1: 5, 2: 15, 3: 25, 4: 40, 5: 60 };
  const tolHours = tolMap[pref.overtime_tolerance] ?? 20;
  const sOvertime =
    ward.avg_overtime <= tolHours
      ? 1
      : Math.max(0, 1 - (ward.avg_overtime - tolHours) / 40);

  // 残業代が出る病棟はボーナス, 前残業は減点, お局がいる病棟は人間関係重視なら減点
  const bonusPay = ward.overtime_paid_ratio * 0.05;
  const penaltyPre = ward.pre_overtime_ratio * 0.05;
  const penaltyDiff =
    ward.has_difficult_person_ratio * (pref.human_relations >= 4 ? 0.1 : 0.05);

  const weightBusy = 1.0;
  const weightOvertime = 1.5;

  const totalWeight =
    weightHuman + weightEdu + weightWlb + weightBusy + weightOvertime;

  const weightedScore =
    (sHuman * weightHuman +
      sEdu * weightEdu +
      sWlb * weightWlb +
      sBusy * weightBusy +
      sOvertime * weightOvertime) /
    totalWeight;

  let score = weightedScore + bonusPay - penaltyPre - penaltyDiff;

  // 希望診療科マッチでボーナス
  if (pref.preferred_department?.includes(ward.ward.department)) {
    score += 0.08;
  }

  return Math.max(0, Math.min(100, Math.round(score * 100)));
}
