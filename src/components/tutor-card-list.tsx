import Image from "next/image";
import Link from "next/link";
import { Tutor } from "@/types/tutor";

interface Props {
  tutor: Tutor;
  image: string;
}

export default function TutorCardList({ tutor, image }: Props) {
  return (
    <div
      className="
        bg-white rounded-xl shadow-md hover:shadow-xl
        p-4 transition-all duration-300 hover:bg-yellow-300/20
        flex flex-col sm:flex-row gap-4
        w-full
      "
    >
      {/* Image */}
      <div
        className="
          relative w-full h-40
          sm:w-56 sm:h-36
          md:w-64 md:h-40
          flex-shrink-0
        "
      >
        <Image
          src={image}
          alt="Tutor illustration"
          fill
          className="object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">
            {tutor.experience}+ years experience
          </p>

          <p className="font-medium text-gray-800 text-base sm:text-xl line-clamp-3">
            {tutor.bio}
          </p>
          <span className="font-semibold text-yellow-500 text-sm sm:text-base">
            ${tutor.hourlyRate}/hr
          </span>
        </div>
        <div
          className="
            flex flex-row sm:flex-col
            justify-between 
            items-start 
            gap-1 mt-3
          "
        >

          <Link
            href={`/tutors/${tutor.id}`}
            className="text-sm sm:text-base text-gray-600 hover:text-yellow-600 font-medium"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}
