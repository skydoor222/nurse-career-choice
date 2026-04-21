import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, BedDouble, Users } from "lucide-react";
import { getHospital, getWardsByHospital, getReviews, summarizeReviews } from "@/lib/queries";
import { WardCard } from "@/components/ward-card";
import type { WardSummary } from "@/types";

export const dynamic = "force-dynamic";

export default async function HospitalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const hospital = await getHospital(params.id);
  if (!hospital) notFound();

  const wards = await getWardsByHospital(hospital.id);

  const summaries: WardSummary[] = await Promise.all(
    wards.map(async (w) => {
      const reviews = await getReviews(w.id);
      return {
        ward: w,
        hospital,
        ...summarizeReviews(reviews),
      };
    })
  );

  return (
    <div>
      <Link
        href="/search"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
      >
        ← 検索に戻る
      </Link>

      <section className="card">
        <h1 className="text-2xl font-medium tracking-tight">{hospital.name}</h1>
        <div className="mt-3 grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {hospital.prefecture} {hospital.address}
          </p>
          <p className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {hospital.hospital_type}
          </p>
          <p className="flex items-center gap-2">
            <BedDouble className="h-4 w-4" />
            {hospital.bed_count}床
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {wards.length}病棟
          </p>
        </div>
        {hospital.description && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/85">
            {hospital.description}
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-medium tracking-tight">所属病棟</h2>
        {summaries.length === 0 ? (
          <p className="card text-sm text-ink-muted">病棟情報はまだありません。</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((s) => (
              <WardCard key={s.ward.id} summary={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
