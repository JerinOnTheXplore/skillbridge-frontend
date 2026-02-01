"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function TutorsFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    p.set(key, value);
    router.push(`/tutors?${p.toString()}`);
  };

  return (
    <aside className="space-y-4">
      <select onChange={(e) => update("limit", e.target.value)}>
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
      </select>

      <select onChange={(e) => update("minRating", e.target.value)}>
        <option value="">Rating</option>
        <option value="4">4+</option>
        <option value="3">3+</option>
      </select>

      <select onChange={(e) => update("minExperience", e.target.value)}>
        <option value="">Experience</option>
        <option value="3">3+ years</option>
        <option value="5">5+ years</option>
      </select>
    </aside>
  );
}
