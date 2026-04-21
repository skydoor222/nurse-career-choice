import { describe, it, expect } from "vitest";
import { summarizeReviews } from "@/lib/queries";
import type { Review } from "@/types";

const mkReview = (overrides: Partial<Review> = {}): Review => ({
  id: "r1",
  ward_id: "w1",
  author_year: 1,
  is_current_staff: true,
  score_human_relations: 3,
  score_busyness: 3,
  score_education: 3,
  score_work_life: 3,
  overtime_avg: 10,
  overtime_paid: true,
  pre_overtime: false,
  has_difficult_person: false,
  body: "",
  created_at: "2026-01-01",
  ...overrides,
});

describe("summarizeReviews", () => {
  it("returns all zeros for empty array", () => {
    const s = summarizeReviews([]);
    expect(s.review_count).toBe(0);
    expect(s.avg_human_relations).toBe(0);
  });

  it("averages numeric scores correctly", () => {
    const reviews = [
      mkReview({ score_human_relations: 5, overtime_avg: 10 }),
      mkReview({ score_human_relations: 1, overtime_avg: 30 }),
    ];
    const s = summarizeReviews(reviews);
    expect(s.review_count).toBe(2);
    expect(s.avg_human_relations).toBe(3);
    expect(s.avg_overtime).toBe(20);
  });

  it("calculates boolean ratios correctly", () => {
    const reviews = [
      mkReview({ overtime_paid: true, pre_overtime: false, has_difficult_person: true }),
      mkReview({ overtime_paid: true, pre_overtime: true, has_difficult_person: false }),
      mkReview({ overtime_paid: false, pre_overtime: false, has_difficult_person: false }),
      mkReview({ overtime_paid: true, pre_overtime: true, has_difficult_person: true }),
    ];
    const s = summarizeReviews(reviews);
    expect(s.overtime_paid_ratio).toBe(0.75);
    expect(s.pre_overtime_ratio).toBe(0.5);
    expect(s.has_difficult_person_ratio).toBe(0.5);
  });
});
