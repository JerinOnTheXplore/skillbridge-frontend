"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function TutorsFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const setRating = (rating: number) => {
    const p = new URLSearchParams(params.toString());
    p.set("minRating", String(rating));
    router.push(`/tutors?${p.toString()}`);
    router.refresh();
  };

  const activeRating = params.get("minRating");

  return (
    <aside className="space-y-3 mb-4">
      
      <div className="flex gap-2">
        {[4, 3, 2].map((r) => (
          <button
            key={r}
            onClick={() => setRating(r)}
            className={`px-3 py-1 rounded-full border text-sm font-medium transition
              ${
                activeRating === String(r)
                  ? "bg-yellow-400 border-yellow-400 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-yellow-100"
              }`}
          >
            ⭐ {r}+
          </button>
        ))}
      </div>
    </aside>
  );
}
