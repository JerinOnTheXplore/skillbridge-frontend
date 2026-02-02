'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  StarIcon as StarIconOutline,
  ChatBubbleLeftIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Booking {
  id: string;
  tutor: {
    user: {
      name: string;
    };
  };
  date: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  tutorId: string;
  bookingId: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    if (bookingId) {
      setSelectedBookingId(bookingId);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch completed bookings
        const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/dashboard/bookings`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const completed = bookingsData.data.filter((b: any) => b.status === 'COMPLETED');
          setCompletedBookings(completed);
          
          // Auto-select first booking if none selected
          if (completed.length > 0 && !selectedBookingId) {
            setSelectedBookingId(completed[0].id);
          }
        }

        // Fetch existing reviews
        const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/dashboard/reviews`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchData();
    }
  }, [session, selectedBookingId]);

  const selectedBooking = completedBookings.find(b => b.id === selectedBookingId);
  const existingReview = reviews.find(r => r.bookingId === selectedBookingId);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;
    
    try {
      setSubmitting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/${selectedBookingId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setReviews(prev => [...prev, data.data]);
        setComment('');
        setRating(5);
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reviews</h1>
          <p className="text-gray-600 mb-8">Rate and review your completed sessions</p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Bookings List */}
            <div className="lg:w-1/3">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Sessions</h2>
              {completedBookings.length > 0 ? (
                <div className="space-y-3">
                  {completedBookings.map((booking) => {
                    const hasReview = reviews.some(r => r.bookingId === booking.id);
                    
                    return (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBookingId(booking.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          selectedBookingId === booking.id
                            ? 'bg-yellow-50 border-2 border-yellow-200'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-800">{booking.tutor.user.name}</span>
                          </div>
                          {hasReview && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Reviewed
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChatBubbleLeftIcon className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-gray-500 mt-2">No completed sessions yet</p>
                </div>
              )}
            </div>

            {/* Right Column - Review Form or Existing Review */}
            <div className="flex-1">
              {selectedBooking ? (
                existingReview ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Your Review</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Submitted
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIconSolid
                          key={star}
                          className={`w-6 h-6 ${
                            star <= existingReview.rating
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">{existingReview.rating}/5</span>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-green-100">
                      <p className="text-gray-800">{existingReview.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Submitted on {formatDate(existingReview.createdAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Review for {selectedBooking.tutor.user.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Session was on {formatDate(selectedBooking.date)}
                      </p>
                    </div>

                    {/* Rating Stars */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        How would you rate this session?
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            {star <= rating ? (
                              <StarIconSolid className="w-10 h-10 text-yellow-500" />
                            ) : (
                              <StarIconOutline className="w-10 h-10 text-gray-300" />
                            )}
                          </button>
                        ))}
                        <span className="ml-4 text-2xl font-bold text-gray-800">{rating}/5</span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review (Optional)
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 text-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                        placeholder="Share your experience with this tutor..."
                        maxLength={500}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {comment.length}/500 characters
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center space-x-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/dashboard/bookings')}
                        className="px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Guidelines */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Review Guidelines</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Be honest about your experience</li>
                        <li>• Focus on the tutor's teaching style</li>
                        <li>• Mention what was helpful</li>
                        <li>• Avoid personal attacks</li>
                        <li>• Reviews help other students make decisions</li>
                      </ul>
                    </div>
                  </form>
                )
              ) : (
                <div className="text-center py-12">
                  <StarIconOutline className="w-16 h-16 text-gray-300 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-600 mt-4">Select a Session</h3>
                  <p className="text-gray-500 mt-2">Choose a completed session to leave a review</p>
                </div>
              )}
            </div>
          </div>

          {/* Your Reviews History */}
          {reviews.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => {
                  const booking = completedBookings.find(b => b.id === review.bookingId);
                  
                  return (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <UserIcon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-800">
                            {booking?.tutor.user.name || 'Tutor'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIconSolid
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-800 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        Reviewed on {formatDate(review.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}