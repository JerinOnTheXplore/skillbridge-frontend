"use client";

import { useEffect, useState } from "react";
import TutorCard from "./tutor-card";
import { getFeaturedTutors } from "@/lib/api";
import { Tutor } from "@/types/tutor";
import { tutorIllustrations } from "@/lib/tutor-illustrations";

export default function FeaturedTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    getFeaturedTutors(6)
      .then(setTutors)
      .catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT: Text */}
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-700">
              Featured <span className="text-yellow-400">Tutors</span>
            </h2>

             <ul className="space-y-4 text-gray-700">
                    <li>
                      • Learn from <span className="font-medium text-gray-800">
                        verified and experienced tutors
                      </span> who are carefully reviewed for quality and expertise.
                    </li>
                  
                    <li>
                      • Enjoy <span className="font-medium text-gray-800">
                        flexible scheduling
                      </span> that fits your routine, with sessions available at your convenience.
                    </li>
                  
                    <li>
                      • Get <span className="font-medium text-gray-800">
                        one-to-one personalized tutoring
                      </span> focused entirely on your learning goals and pace.
                    </li>
                  
                    <li>
                      • Benefit from <span className="font-medium text-gray-800">
                        transparent hourly pricing
                      </span> with no hidden fees or long-term commitments.
                    </li>
                    <li>
                    • Access tutors across <span className="font-medium text-gray-800">
                      multiple subjects and skill levels
                    </span>, from beginners to advanced learners.
                    </li>
                  
                    <li>
                    • Learn in a <span className="font-medium text-gray-800">
                      secure and reliable platform
                    </span> with verified profiles and session tracking.
                    </li>
              </ul>
          </div>

          {/* RIGHT: Cards */}
          <div className="relative max-h-[540px] overflow-y-auto pr-2">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {tutors.map((tutor, idx) => (
      <TutorCard
        key={tutor.id}
        {...tutor}
        image={
          tutorIllustrations[idx % tutorIllustrations.length]
        }
        offset={idx % 2 === 0 ? "up" : "down"}
      />
    ))}
  </div>
</div>
        </div>
      </div>
    </section>
  );
}
