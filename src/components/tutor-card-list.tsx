import Image from "next/image";
import Link from "next/link";
import { Tutor } from "@/types/tutor";

interface Props {
  tutor: Tutor;
  image: string;
}

export default function TutorCardList({ tutor, image }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-4 flex gap-4 transition-colors duration-300 hover:bg-yellow-200/20 w-full min-h-[120px] sm:min-h-[150px]">
      {/* Image left */}
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image
          src={image}
          alt="Tutor illustration"
          fill
          className="object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Info right */}
      <div className="flex-1 flex flex-col justify-between">
        <p className="text-xs text-gray-600 mb-1">
          {tutor.experience}+ years experience
        </p>
        <p className="font-medium text-gray-800 line-clamp-3 mb-2">
          {tutor.bio}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-semibold text-yellow-500">
            ${tutor.hourlyRate}/hr
          </span>
          <Link
            href={`/tutors/${tutor.id}`}
            className="text-sm text-gray-600 hover:text-yellow-600 font-medium"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}
