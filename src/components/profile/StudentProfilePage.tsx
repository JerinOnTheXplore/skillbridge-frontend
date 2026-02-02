'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  UserIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  tutor: {
    id: string;
    userId: string;
    bio: string;
    hourlyRate: number;
    experience: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/dashboard/bookings`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchBookings();
    }
  }, [session]);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return booking.status === 'CONFIRMED';
    if (activeTab === 'completed') return booking.status === 'COMPLETED';
    if (activeTab === 'cancelled') return booking.status === 'CANCELLED';
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'CANCELLED' }
            : booking
        ));
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-gray-600 mt-2">Manage and view all your tutoring sessions</p>
            </div>
            <button
              onClick={() => router.push('/tutors')}
              className="mt-4 sm:mt-0 px-6 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
            >
              Book New Session
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'upcoming' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Upcoming ({bookings.filter(b => b.status === 'CONFIRMED').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'completed' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Completed ({bookings.filter(b => b.status === 'COMPLETED').length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'cancelled' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Cancelled ({bookings.filter(b => b.status === 'CANCELLED').length})
            </button>
          </div>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200/50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">{booking.tutor.user.name}</h3>
                              <p className="text-gray-600">{booking.tutor.user.email}</p>
                            </div>
                            <span className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'CONFIRMED' 
                                ? 'bg-yellow-100 text-yellow-700'
                                : booking.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Session Date</p>
                                <p className="font-medium text-gray-800">{formatDate(booking.date)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Rate</p>
                                <p className="font-medium text-gray-800">${booking.tutor.hourlyRate}/hr</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <StarIcon className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Tutor Rating</p>
                                <p className="font-medium text-gray-800">{booking.tutor.rating || 'No ratings yet'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <p className="mt-4 text-gray-600 line-clamp-2">{booking.tutor.bio}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 lg:w-48">
                      {booking.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
                          >
                            <XCircleIcon className="w-5 h-5" />
                            <span>Cancel Booking</span>
                          </button>
                          <button
                            onClick={() => router.push(`/tutors/${booking.tutorId}`)}
                            className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            View Tutor Profile
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'COMPLETED' && (
                        <button
                          onClick={() => router.push(`/dashboard/reviews?bookingId=${booking.id}`)}
                          className="w-full px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                        >
                          <StarIcon className="w-5 h-5" />
                          <span>Add Review</span>
                        </button>
                      )}
                      
                      {booking.status === 'CANCELLED' && (
                        <button
                          onClick={() => router.push(`/tutors/${booking.tutorId}`)}
                          className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Book Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-gray-600">No bookings found</h3>
              <p className="text-gray-500 mt-2">You haven't booked any sessions yet.</p>
              <button
                onClick={() => router.push('/tutors')}
                className="mt-4 px-6 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
              >
                Find Tutors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}