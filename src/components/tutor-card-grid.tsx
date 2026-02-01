
import Image from "next/image";
import Link from "next/link";
import { Tutor } from "@/types/tutor";

interface Props {
  tutor: Tutor;
  image: string;
}

export default function TutorCardGrid({ tutor, image }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-xl hover:shadow-xl p-4 transition-colors duration-300 hover:bg-yellow-300/20 flex flex-col justify-between w-full">
      {/* Image on top */}
      <div className="relative w-full h-40 mb-4">
        <Image
          src={image}
          alt="Tutor illustration"
          fill
          className="object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <p className="text-base text-gray-700 mb-1">
          {tutor.experience}+ years experience
        </p>
        <p className="font-medium text-base text-gray-800 line-clamp-2 ">
          {tutor.bio}
        </p>
        <p className="font-semibold text-yellow-500">
            ${tutor.hourlyRate}/hr
          </p>
        <div className="flex flex-col">
          <Link
            href={`/tutors/${tutor.id}`}
            className="text-base text-gray-600 hover:text-yellow-600 font-medium"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}
