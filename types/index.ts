export type UserType = "student" | "nurse";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  prefecture: string;
  hospital_type: string;
  bed_count: number;
  description: string;
  created_at: string;
}

export interface Ward {
  id: string;
  hospital_id: string;
  name: string;
  department: string;
  description: string;
  staff_count: number;
  created_at: string;
}

export interface Review {
  id: string;
  ward_id: string;
  author_year: number;
  is_current_staff: boolean;
  score_human_relations: number;
  score_busyness: number;
  score_education: number;
  score_work_life: number;
  overtime_avg: number;
  overtime_paid: boolean;
  pre_overtime: boolean;
  has_difficult_person: boolean;
  body: string;
  created_at: string;
}

export interface Internship {
  id: string;
  ward_id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  remaining: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  school_name: string | null;
  graduation_year: number | null;
  user_type: UserType;
  preferred_prefecture: string | null;
  preferred_department: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  internship_id: string;
  motivation: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  ward_id: string;
  created_at: string;
}

export interface MatchingAnswer {
  questionId: number;
  value: string;
}

export interface MatchingScores {
  human_relations: number;
  busyness: number;
  education: number;
  work_life: number;
  overtime_tolerance: number;
}

export interface WardSummary {
  ward: Ward;
  hospital: Hospital;
  review_count: number;
  avg_human_relations: number;
  avg_busyness: number;
  avg_education: number;
  avg_work_life: number;
  avg_overtime: number;
  overtime_paid_ratio: number;
  pre_overtime_ratio: number;
  has_difficult_person_ratio: number;
}
