"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Star,
  DollarSign,
  Briefcase,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface Tutor {
  id: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  rating: number;
  user: {
    name: string;
    status: string;
  };
  categories: { id: string; name: string }[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
}

const tutorIllustrations = [
  "/tutors/tutor-1.png",
  "/tutors/tutor-2.png",
  "/tutors/tutor-3.png",
  "/tutors/tutor-4.png",
  "/tutors/tutor-5.png",
];

export default function TutorDetailsPage() {
  const { data: session, status } = useSession();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const image =
    tutorIllustrations[Math.floor(Math.random() * tutorIllustrations.length)];

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/tutors/${id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setTutor(data.data || data);
      } catch {
        toast.error("Failed to load tutor");
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  useEffect(() => {
    if (!tutor?.id) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/${tutor.id}/reviews`,
          { credentials: "include" }
        );
        const data = await res.json();
        setReviews(data.data || []);
      } catch {
        setReviews([]);
      }
    };

    fetchReviews();
  }, [tutor]);

  
  const handleBooking = async () => {
  const token = session?.accessToken;

  console.log("ACCESS TOKEN", token);

  if (!token) {
    toast.error("Please login first");
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorId: tutor!.id,
          date: new Date().toISOString(),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Booking failed");
    }

    toast.success("Session booked successfully 🎉");
    router.push("/profile");
  } catch (err: any) {
    toast.error(err.message || "Booking failed");
  }
};



  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  if (!tutor) {
    return <p className="text-center py-20">Tutor not found</p>;
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-32">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 space-y-10 text-gray-700">
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src="/tutors/avatar-placeholder.png"
                className="w-20 h-20 rounded-full border-2 border-yellow-400 object-cover"
              />

              <div className="flex-1">
                <p className="text-sm text-gray-500">Instructor</p>
                <h1 className="text-2xl font-bold text-gray-800">
                  {tutor.user.name}
                </h1>
              </div>

              <div className="flex gap-4">
                {tutor.categories.map((cat) => (
                  <div key={cat.id} className="text-center">
                    <BookOpen className="mx-auto text-yellow-400" />
                    <p className="text-sm font-medium">{cat.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <p className="text-lg font-semibold">{tutor.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Stat icon={<DollarSign />} label="Hourly Rate" value={`$${tutor.hourlyRate}/hr`} />
              <Stat icon={<Briefcase />} label="Experience" value={`${tutor.experience} years`} />
              <Stat icon={<Star />} label="Rating" value={tutor.rating > 0 ? tutor.rating.toFixed(1) : "No reviews"} />
              <Stat icon={<ShieldCheck />} label="Status" value={tutor.user.status} />
            </div>

            {/* Overview */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Overview</h2>

              <p className="leading-relaxed">
                This learning experience is carefully designed to strengthen
                conceptual understanding while building confidence through
                real-world problem solving. Students will develop analytical
                thinking, master core fundamentals, and apply knowledge
                independently.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <img src="/overview/learn-1.png" className="rounded-xl" />
                <img src="/overview/learn-2.png" className="rounded-xl" />
              </div>
              <p className="leading-relaxed">
  This learning experience is carefully designed to strengthen
  conceptual understanding while building confidence through
  real-world problem solving. Students will develop analytical
  thinking, master core fundamentals, and apply knowledge
  independently. By the end of this journey, learners will not only
  achieve academic improvement but also gain the confidence and skills
  needed to succeed in advanced topics and real-life applications.
</p>

            </section>

            {/* Reviews */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Student Reviews</h2>

              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="border rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400" />
                      <span className="font-semibold">{r.rating}</span>
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))
              )}
            </section>
          </div>

          <div className="w-full lg:w-[360px]">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 lg:sticky lg:top-24">
              <img src={image} className="rounded-xl w-full" />
              <h3 className="text-lg font-bold text-center text-gray-800">
                {tutor.user.name}
              </h3>

              <button
                onClick={handleBooking}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl transition"
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-yellow-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
