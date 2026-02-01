import TutorCardGrid from "./tutor-card-grid";
import { tutorIllustrations } from "@/lib/tutor-illustrations";

export default function FeaturedTutorsSide() {
  return (
    <aside className="hidden lg:flex flex-col gap-4 max-w-3xl">
      {[0, 1, 2, 3].map((i) => (
        <TutorCardGrid
          key={i}
          tutor={{
            id: "x",
            bio: "Top rated tutor",
            hourlyRate: 30,
            experience: 5,
            rating: 5,
          } as any}
          image={tutorIllustrations[i]}
        />
      ))}
    </aside>
  );
}
