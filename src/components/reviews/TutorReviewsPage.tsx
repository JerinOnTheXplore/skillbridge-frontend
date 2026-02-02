'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  CheckBadgeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0], // 1-5 stars
  });
  const { data: session } = useSession();

  // Fetch reviews data
  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        setLoading(true);
        
        // Fetch tutor profile for rating
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tutors/profile/me`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        // Fetch tutor's reviews
        const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tutors/reviews`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setTutorProfile(profileData.data || {});
        }
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          const reviewsList = reviewsData.data || [];
          setReviews(reviewsList);
          
          // Calculate rating statistics
          if (reviewsList.length > 0) {
            const totalRating = reviewsList.reduce((sum: number, review: any) => sum + review.rating, 0);
            const averageRating = totalRating / reviewsList.length;
            
            const distribution = [0, 0, 0, 0, 0];
            reviewsList.forEach((review: any) => {
              if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++;
              }
            });
            
            setRatingStats({
              average: parseFloat(averageRating.toFixed(1)),
              total: reviewsList.length,
              distribution,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching reviews data:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchReviewsData();
    }
  }, [session]);

  // Handle reply to review
  const handleReplySubmit = async (reviewId: string, replyText: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyText }),
      });
      
      if (response.ok) {
        const updatedReview = await response.json();
        
        // Update local state
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, reply: replyText, repliedAt: new Date().toISOString() }
            : review
        ));
        
        toast.success('Reply submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to submit reply');
    }
  };

  // Handle delete reply
  const handleDeleteReply = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/${reviewId}/reply`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
        },
      });
      
      if (response.ok) {
        // Update local state
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, reply: null, repliedAt: null }
            : review
        ));
        
        toast.success('Reply deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Failed to delete reply');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
            Reviews & Ratings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and respond to student reviews
          </p>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Overall Rating Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-2xl border border-yellow-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Overall Rating</h2>
                <p className="text-gray-600">Based on {ratingStats.total} reviews</p>
              </div>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <StarIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="text-5xl font-bold text-gray-800 mr-3">
                  {ratingStats.average}
                </div>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.floor(ratingStats.average)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {ratingStats.average.toFixed(1)} out of 5
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Rating Distribution</h2>
            
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingStats.distribution[stars - 1] || 0;
                const percentage = ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
                
                return (
                  <div key={stars} className="flex items-center">
                    <div className="flex items-center w-20">
                      <span className="text-gray-600 mr-2">{stars}</span>
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                    </div>
                    
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-yellow-400 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="w-16 text-right">
                      <span className="text-sm text-gray-600">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">All Reviews</h2>
                <p className="text-gray-600 text-sm">
                  {reviews.length} total reviews
                </p>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Respond to student feedback</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start">
                    {/* Student Info & Rating */}
                    <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {review.student?.name || 'Anonymous Student'}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-800 font-medium">
                          {review.rating}.0
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckBadgeIcon className="w-4 h-4 mr-1" />
                        <span>Verified Session</span>
                      </div>
                    </div>
                    
                    {/* Review Content */}
                    <div className="md:w-2/3">
                      <div className="mb-4">
                        <p className="text-gray-800 whitespace-pre-line">
                          {review.comment || 'No comment provided.'}
                        </p>
                      </div>
                      
                      {/* Reply Section */}
                      {review.reply ? (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                                <PencilIcon className="w-4 h-4 text-yellow-700" />
                              </div>
                              <span className="font-medium text-yellow-800">Your Reply</span>
                              {review.repliedAt && (
                                <span className="text-sm text-yellow-600">
                                  • {formatDate(review.repliedAt)}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteReply(review.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-yellow-800">{review.reply}</p>
                        </div>
                      ) : (
                        <ReplyForm
                          reviewId={review.id}
                          onSubmit={handleReplySubmit}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500">
                  Student reviews will appear here once they submit feedback.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Tips */}
        <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Tips for Responding to Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-800">Be Professional</h4>
              </div>
              <p className="text-sm text-gray-600">
                Always maintain a professional tone, even when addressing negative feedback.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-800">Be Timely</h4>
              </div>
              <p className="text-sm text-gray-600">
                Respond to reviews within 24-48 hours to show you value student feedback.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-800">Be Grateful</h4>
              </div>
              <p className="text-sm text-gray-600">
                Thank students for their feedback and mention specific aspects of their review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reply Form Component
function ReplyForm({ reviewId, onSubmit }: { reviewId: string, onSubmit: (id: string, reply: string) => void }) {
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    
    setSubmitting(true);
    await onSubmit(reviewId, reply);
    setReply('');
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3">
        <label htmlFor={`reply-${reviewId}`} className="block text-sm font-medium text-gray-700 mb-1">
          Reply to this review
        </label>
        <textarea
          id={`reply-${reviewId}`}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="Write a professional response to this review..."
          maxLength={500}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {reply.length}/500 characters
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !reply.trim()}
          className="px-4 py-2 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Reply'}
        </button>
      </div>
    </form>
  );
}