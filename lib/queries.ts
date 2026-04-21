import { createServer } from "./supabase";
import type { Hospital, Review, Ward, WardSummary, Internship } from "@/types";

export async function getHospitals(filters?: {
  prefecture?: string;
  keyword?: string;
}) {
  const sb = createServer();
  let q = sb.from("hospitals").select("*").order("name");
  if (filters?.prefecture) q = q.eq("prefecture", filters.prefecture);
  if (filters?.keyword) q = q.ilike("name", `%${filters.keyword}%`);
  const { data } = await q;
  return (data ?? []) as Hospital[];
}

export async function getHospital(id: string) {
  const sb = createServer();
  const { data } = await sb.from("hospitals").select("*").eq("id", id).single();
  return data as Hospital | null;
}

export async function getWardsByHospital(hospital_id: string) {
  const sb = createServer();
  const { data } = await sb.from("wards").select("*").eq("hospital_id", hospital_id).order("name");
  return (data ?? []) as Ward[];
}

export async function getWard(id: string) {
  const sb = createServer();
  const { data } = await sb.from("wards").select("*").eq("id", id).single();
  return data as Ward | null;
}

export async function getReviews(ward_id: string) {
  const sb = createServer();
  const { data } = await sb
    .from("reviews")
    .select("*")
    .eq("ward_id", ward_id)
    .order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}

export function summarizeReviews(reviews: Review[]) {
  if (!reviews.length) {
    return {
      review_count: 0,
      avg_human_relations: 0,
      avg_busyness: 0,
      avg_education: 0,
      avg_work_life: 0,
      avg_overtime: 0,
      overtime_paid_ratio: 0,
      pre_overtime_ratio: 0,
      has_difficult_person_ratio: 0,
    };
  }
  const n = reviews.length;
  const sum = (fn: (r: Review) => number) => reviews.reduce((a, r) => a + fn(r), 0);
  return {
    review_count: n,
    avg_human_relations: sum((r) => r.score_human_relations) / n,
    avg_busyness: sum((r) => r.score_busyness) / n,
    avg_education: sum((r) => r.score_education) / n,
    avg_work_life: sum((r) => r.score_work_life) / n,
    avg_overtime: sum((r) => r.overtime_avg) / n,
    overtime_paid_ratio: sum((r) => (r.overtime_paid ? 1 : 0)) / n,
    pre_overtime_ratio: sum((r) => (r.pre_overtime ? 1 : 0)) / n,
    has_difficult_person_ratio: sum((r) => (r.has_difficult_person ? 1 : 0)) / n,
  };
}

export async function searchWards(filters: {
  keyword?: string;
  prefecture?: string;
  department?: string;
  sort?: "human_relations" | "newest" | "less_overtime";
}): Promise<WardSummary[]> {
  const sb = createServer();
  let q = sb
    .from("wards")
    .select("*, hospital:hospitals(*), reviews:reviews(*)")
    .limit(200);
  if (filters.department) q = q.eq("department", filters.department);
  if (filters.keyword) q = q.ilike("name", `%${filters.keyword}%`);
  const { data } = await q;
  let rows = ((data ?? []) as any[])
    .filter((row) => row.hospital)
    .filter((row) =>
      filters.prefecture ? row.hospital.prefecture === filters.prefecture : true
    )
    .filter((row) =>
      filters.keyword
        ? (row.name as string).includes(filters.keyword) ||
          (row.hospital.name as string).includes(filters.keyword)
        : true
    )
    .map<WardSummary>((row) => {
      const s = summarizeReviews(row.reviews ?? []);
      return {
        ward: {
          id: row.id,
          hospital_id: row.hospital_id,
          name: row.name,
          department: row.department,
          description: row.description,
          staff_count: row.staff_count,
          created_at: row.created_at,
        },
        hospital: row.hospital,
        ...s,
      };
    });

  if (filters.sort === "human_relations") {
    rows.sort((a, b) => b.avg_human_relations - a.avg_human_relations);
  } else if (filters.sort === "less_overtime") {
    rows.sort((a, b) => a.avg_overtime - b.avg_overtime);
  } else {
    rows.sort((a, b) => (a.ward.created_at < b.ward.created_at ? 1 : -1));
  }
  return rows;
}

export async function getInternships(filters?: {
  department?: string;
  prefecture?: string;
  dateFrom?: string;
}) {
  const sb = createServer();
  let q = sb
    .from("internships")
    .select("*, ward:wards(*, hospital:hospitals(*))")
    .eq("is_active", true)
    .order("date");
  if (filters?.dateFrom) q = q.gte("date", filters.dateFrom);
  const { data } = await q;
  let rows = (data ?? []) as any[];
  if (filters?.department)
    rows = rows.filter((r) => r.ward?.department === filters.department);
  if (filters?.prefecture)
    rows = rows.filter((r) => r.ward?.hospital?.prefecture === filters.prefecture);
  return rows;
}

export async function getInternship(id: string) {
  const sb = createServer();
  const { data } = await sb
    .from("internships")
    .select("*, ward:wards(*, hospital:hospitals(*))")
    .eq("id", id)
    .single();
  return data as (Internship & { ward: any }) | null;
}

export async function getActiveInternshipForWard(ward_id: string) {
  const sb = createServer();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await sb
    .from("internships")
    .select("*")
    .eq("ward_id", ward_id)
    .eq("is_active", true)
    .gte("date", today)
    .order("date")
    .limit(1);
  return (data?.[0] ?? null) as Internship | null;
}
