"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tutor } from "@/types/tutor";
import TutorCardGrid from "./tutor-card-grid";
import TutorCardList from "./tutor-card-list";
import { tutorIllustrations } from "@/lib/tutor-illustrations";

export default function TutorsList({ view }: { view: string }) {
  const params = useSearchParams();
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/tutors?${params.toString()}`
    )
      .then((r) => r.json())
      .then((d) => setTutors(d.data || []));
  }, [params]);

  return (
    <div
      className={
        view === "grid"
          ? "grid sm:grid-cols-2 gap-6"
          : "flex flex-col gap-4"
      }
    >
      {tutors.map((t, i) =>
        view === "grid" ? (
          <TutorCardGrid
            key={t.id}
            tutor={t}
            image={tutorIllustrations[i % 4]}
          />
        ) : (
          <TutorCardList
            key={t.id}
            tutor={t}
            image={tutorIllustrations[i % 4]}
          />
        )
      )}
    </div>
  );
}
