"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Star, CalendarCheck, Clock, UploadCloud } from "lucide-react";

interface Booking {
  id: string;
  tutorId: string;
  date: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  tutor: {
    user: {
      name: string;
      email: string;
      status: string;
    };
    bio: string;
    hourlyRate: number;
    experience: number;
    rating: number;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  tutor: {
    user: { name: string };
  };
}

export default function ManageProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const fetchBookings = async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await res.json();
      setBookings(data.data || []);
    } catch {
      toast.error("Failed to fetch bookings");
    }
  };

  const fetchReviews = async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/student/reviews`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await res.json();
      setReviews(data.data || []);
    } catch {
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    if (!session) return;
    fetchBookings();
    fetchReviews();
    setLoading(false);
  }, [session]);

  const openReviewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setReviewRating(5);
    setReviewComment("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking || !session?.accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/bookings/${selectedBooking.id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Review submission failed");
      toast.success("Review submitted!");
      setShowReviewModal(false);
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Manage <span className="text-yellow-400">Your Profile</span>
        </h1>

        {/*random public */}
        <div className="flex items-center gap-4 mb-12">
          <div className="relative w-28 h-28">
            <img
              src="/default-profile.png" // public folder er image
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400"
            />
          </div>
          <div>
            <p className="text-gray-600 text-xl font-normal">Student</p>
            <h2 className="text-xl font-bold text-gray-600">{session?.user?.name}</h2>
            <p className="text-gray-700 font-medium">{session?.user?.email}</p>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800">Your Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-6 border rounded-xl shadow hover:shadow-lg transition bg-yellow-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">{b.tutor.user.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        b.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : b.status === "CONFIRMED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{b.tutor.bio}</p>
                  <p className="text-gray-700 mt-2">
                    <CalendarCheck className="inline mr-1" />{" "}
                    {new Date(b.date).toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    <Clock className="inline mr-1" /> ${b.tutor.hourlyRate}/hr | {b.tutor.experience} yrs
                  </p>

                  {/* Review button only for completed bookings */}
                  {b.status === "COMPLETED" &&
                    !reviews.find((r) => r.id === b.id) && (
                      <button
                        onClick={() => openReviewModal(b)}
                        className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-xl transition"
                      >
                        Leave Review
                      </button>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews submitted yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="p-6 border rounded-xl shadow bg-yellow-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-yellow-400" /> <span>{r.rating}</span>
                  </div>
                  <p className="text-gray-700 mb-1">{r.comment}</p>
                  <p className="text-gray-500 text-sm">Tutor: {r.tutor.user.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
              <h3 className="text-xl font-bold mb-4">
                Leave a Review for {selectedBooking.tutor.user.name}
              </h3>
              <label className="block mb-2">Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-4"
              />
              <label className="block mb-2">Comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
