import { describe, it, expect } from "vitest";
import {
  QUESTIONS,
  computeUserPreference,
  computeMatchScore,
} from "@/lib/matching";
import type { WardSummary } from "@/types";

const baseWard = (overrides: Partial<WardSummary> = {}): WardSummary => ({
  ward: {
    id: "w1",
    hospital_id: "h1",
    name: "内科病棟",
    department: "内科",
    description: "",
    staff_count: 20,
    created_at: "2026-01-01",
  },
  hospital: {
    id: "h1",
    name: "テスト病院",
    address: "東京都",
    prefecture: "東京都",
    hospital_type: "総合病院",
    bed_count: 100,
    description: "",
    created_at: "2026-01-01",
  },
  review_count: 5,
  avg_human_relations: 3,
  avg_busyness: 3,
  avg_education: 3,
  avg_work_life: 3,
  avg_overtime: 15,
  overtime_paid_ratio: 0.5,
  pre_overtime_ratio: 0.2,
  has_difficult_person_ratio: 0.2,
  ...overrides,
});

describe("QUESTIONS", () => {
  it("has exactly 10 questions", () => {
    expect(QUESTIONS.length).toBe(10);
  });

  it("every question has >=2 options", () => {
    QUESTIONS.forEach((q) => {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("question IDs are unique and sequential", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe(1);
    expect(ids[ids.length - 1]).toBe(10);
  });
});

describe("computeUserPreference", () => {
  it("returns default (~3) values when no answers given", () => {
    const pref = computeUserPreference([]);
    expect(pref.human_relations).toBeGreaterThanOrEqual(1);
    expect(pref.human_relations).toBeLessThanOrEqual(5);
  });

  it("gives high human_relations weight when user picks 'relations'", () => {
    const pref = computeUserPreference([{ questionId: 1, value: "relations" }]);
    expect(pref.human_relations).toBe(5);
  });

  it("gives high work_life weight when user emphasizes WLB", () => {
    const pref = computeUserPreference([
      { questionId: 1, value: "wlb" },
      { questionId: 8, value: "very" },
    ]);
    expect(pref.work_life).toBe(5);
  });

  it("lowers overtime tolerance when user says 'ほぼなし'", () => {
    const pref = computeUserPreference([{ questionId: 2, value: "none" }]);
    expect(pref.overtime_tolerance).toBe(1);
  });

  it("raises overtime tolerance when user says '気にしない'", () => {
    const pref = computeUserPreference([{ questionId: 2, value: "any" }]);
    expect(pref.overtime_tolerance).toBe(5);
  });

  it("maps diagnostic preferences to preferred_department list", () => {
    const pref = computeUserPreference([{ questionId: 10, value: "acute" }]);
    expect(pref.preferred_department).toContain("ICU");
  });
});

describe("computeMatchScore", () => {
  it("returns 0 when ward has no reviews", () => {
    const pref = computeUserPreference([]);
    const score = computeMatchScore(pref, baseWard({ review_count: 0 }));
    expect(score).toBe(0);
  });

  it("returns a score between 0 and 100", () => {
    const pref = computeUserPreference([]);
    const score = computeMatchScore(pref, baseWard());
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("scores a 'relations-focused user + good relations ward' high", () => {
    const pref = computeUserPreference([
      { questionId: 1, value: "relations" },
      { questionId: 2, value: "none" },
      { questionId: 8, value: "very" },
    ]);
    const goodWard = baseWard({
      avg_human_relations: 4.8,
      avg_education: 4.5,
      avg_work_life: 4.5,
      avg_busyness: 2,
      avg_overtime: 5,
      overtime_paid_ratio: 1,
      pre_overtime_ratio: 0,
      has_difficult_person_ratio: 0,
    });
    const score = computeMatchScore(pref, goodWard);
    expect(score).toBeGreaterThan(75);
  });

  it("penalizes heavy-overtime ward for overtime-averse user", () => {
    const pref = computeUserPreference([
      { questionId: 1, value: "wlb" },
      { questionId: 2, value: "none" },
      { questionId: 8, value: "very" },
    ]);
    const busyWard = baseWard({
      avg_human_relations: 4,
      avg_overtime: 55,
      avg_busyness: 5,
      overtime_paid_ratio: 0,
      pre_overtime_ratio: 0.9,
    });
    const score = computeMatchScore(pref, busyWard);
    expect(score).toBeLessThan(55);
  });

  it("penalizes wards with difficult people for relations-focused users more than others", () => {
    const relationsUser = computeUserPreference([
      { questionId: 1, value: "relations" },
    ]);
    const neutralUser = computeUserPreference([
      { questionId: 1, value: "growth" },
    ]);
    const wardWithDifficult = baseWard({
      has_difficult_person_ratio: 1,
      avg_human_relations: 3,
    });
    const relScore = computeMatchScore(relationsUser, wardWithDifficult);
    const neuScore = computeMatchScore(neutralUser, wardWithDifficult);
    expect(relScore).toBeLessThan(neuScore);
  });

  it("gives bonus for preferred department match", () => {
    const acuteUser = computeUserPreference([
      { questionId: 10, value: "acute" },
    ]);
    const icuWard = baseWard({
      ward: { ...baseWard().ward, department: "ICU" },
    });
    const internalWard = baseWard({
      ward: { ...baseWard().ward, department: "内科" },
    });
    const icuScore = computeMatchScore(acuteUser, icuWard);
    const internalScore = computeMatchScore(acuteUser, internalWard);
    expect(icuScore).toBeGreaterThan(internalScore);
  });
});
