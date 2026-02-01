import Image from "next/image";
import Link from "next/link";

interface TutorCardProps {
  id: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  rating: number;
  image: string;
  offset?: "up" | "down";
}

export default function TutorCard({
  id,
  bio,
  hourlyRate,
  experience,
  rating,
  image,
  offset = "up",
}: TutorCardProps) {
  return (
    <div
      className={`transition-transform ${
        offset === "down" ? "mt-8" : ""
      }`}
    >
      {/* group added */}
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 h-full flex flex-col justify-between
        transition-colors duration-300 hover:bg-yellow-300/20"
      >
        {/* Top */}
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">
              {experience}+ years experience
            </p>

            <p className="font-medium text-gray-800 line-clamp-3">
              {bio}
            </p>

            <div className="mt-2 text-sm text-gray-600">
              ⭐ {rating || "New"}
            </div>
          </div>

          {/* Image wrapper */}
          <div className="relative w-24 h-24 shrink-0 overflow-hidden">
            <Image
              src={image}
              alt="Tutor illustration"
              fill
              className="object-contain transition-transform duration-300
                group-hover:scale-110"
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-yellow-500">
            ${hourlyRate}/hr
          </span>

          <Link
            href={`/tutors/${id}`}
            className="text-sm font-medium text-gray-600
              transition-colors duration-300
              group-hover:text-yellow-600"
          >
            Know more →
          </Link>
        </div>
      </div>
    </div>
  );
}
