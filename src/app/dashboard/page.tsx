'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon as ClockIconSolid,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Navigation items based on role
const getNavItems = (role: string) => {
  const common = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  ];

  if (role === 'STUDENT') {
    return [
      ...common,
      { name: 'Find Tutors', href: '/tutors', icon: AcademicCapIcon },
      { name: 'Reviews', href: '/dashboard/reviews', icon: StarIcon },
    ];
  }

  if (role === 'TUTOR') {
    return [
      ...common,
      { name: 'My Sessions', href: '/dashboard/sessions', icon: CalendarIcon },
      { name: 'Availability', href: '/dashboard/availability', icon: ClockIcon },
      { name: 'Reviews', href: '/dashboard/reviews', icon: StarIcon },
      { name: 'Earnings', href: '/dashboard/earnings', icon: ChartBarIcon },
    ];
  }

  if (role === 'ADMIN') {
    return [
      ...common,
      { name: 'All Users', href: '/admin/users', icon: UsersIcon },
      { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    ];
  }

  return common;
};

// Types

interface AdminStats {
  users: {
    total: number;
    students: number;
    tutors: number;
    admins: number;
    banned: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  reviews: {
    total: number;
  };
  tutors: {
    totalProfiles: number;
    avgRating: number;
  };
}
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'BANNED';
  createdAt: string;
}
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
  student?: {
    id: string;
    name: string;
    email: string;
  };
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}


interface TutorProfile {
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
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  studentId: string;
  tutorId: string;
  bookingId: string;
  createdAt: string;
}

// Student Dashboard Component
function StudentDashboard({ session }: { session: any }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const router = useRouter();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch student bookings
        const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/dashboard/bookings`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.data || []);
        }

        // Fetch student profile
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/dashboard/profile`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setStudentProfile(profileData.data || null);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [session]);

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const uniqueTutorIds = new Set(bookings.map(b => b.tutorId));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelBooking = async (bookingId: string) => {
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
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading student dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <CalendarIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">{upcomingBookings.length} upcoming</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{bookings.length}</h3>
          <p className="text-gray-600">Total Sessions</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <AcademicCapIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">{completedBookings.length} completed</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{uniqueTutorIds.size}</h3>
          <p className="text-gray-600">Active Tutors</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <ClockIconSolid className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">1h per session</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{completedBookings.length}</h3>
          <p className="text-gray-600">Hours Learned</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <StarIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">Your rating</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">4.8</h3>
          <p className="text-gray-600">Average Rating</p>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="border-t border-gray-200/50 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Your Bookings</h2>
          <div className="flex space-x-2 bg-gray-100/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'upcoming' ? 'bg-yellow-400 text-gray-800' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'completed' ? 'bg-yellow-400 text-gray-800' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Completed ({completedBookings.length})
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/50">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Tutor</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Session Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Rate</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'upcoming' ? (
                upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200/50 hover:bg-gray-50/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{booking.tutor.user.name}</p>
                          <p className="text-sm text-gray-500">{booking.tutor.user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800">{formatDate(booking.date)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800">${booking.tutor.hourlyRate}/hr</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => router.push(`/tutors/${booking.tutorId}`)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No upcoming bookings. <Link href="/tutors" className="text-yellow-600 hover:underline">Book a session now!</Link>
                    </td>
                  </tr>
                )
              ) : (
                completedBookings.length > 0 ? (
                  completedBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200/50 hover:bg-gray-50/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{booking.tutor.user.name}</p>
                          <p className="text-sm text-gray-500">{booking.tutor.user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800">{formatDate(booking.date)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800">${booking.tutor.hourlyRate}/hr</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          COMPLETED
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => router.push(`/dashboard/reviews?bookingId=${booking.id}`)}
                          className="px-3 py-1 text-sm bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                          Add Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No completed sessions yet
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {bookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg backdrop-blur-sm">
              <div>
                <p className="font-medium text-gray-800">
                  {booking.status === 'COMPLETED' 
                    ? `Session completed with ${booking.tutor.user.name}` 
                    : `Booking ${booking.status.toLowerCase()} with ${booking.tutor.user.name}`
                  }
                </p>
                <p className="text-sm text-gray-500">{formatDate(booking.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.status === 'COMPLETED' ? 'Completed' : 'Active'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => router.push('/tutors')}
            className="px-4 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
          >
            Book New Session
          </button>
        </div>
      </div>
    </div>
  );
}

// Tutor Dashboard Component
function TutorDashboard({ session }: { session: any }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const router = useRouter();

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        setLoading(true);
        
        // Fetch tutor bookings
        const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/tutor`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.data || []);
        }

        // Fetch tutor profile
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tutors/profile/me`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setTutorProfile(profileData.data || null);
        }
      } catch (error) {
        console.error('Error fetching tutor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTutorData();
  }, [session]);

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const totalEarnings = completedBookings.length * (tutorProfile?.hourlyRate || 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkComplete = async (bookingId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/${bookingId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'COMPLETED' }
            : booking
        ));
      }
    } catch (error) {
      console.error('Error marking booking as complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tutor dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <CalendarIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">{upcomingBookings.length} upcoming</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{bookings.length}</h3>
          <p className="text-gray-600">Total Bookings</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <CurrencyDollarIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">${tutorProfile?.hourlyRate || 0}/hr</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">${totalEarnings}</h3>
          <p className="text-gray-600">Total Earnings</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <UserGroupIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">{completedBookings.length} completed</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{completedBookings.length}</h3>
          <p className="text-gray-600">Completed Sessions</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <StarIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">{tutorProfile?.rating || 0}/5</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{tutorProfile?.experience || 0}+</h3>
          <p className="text-gray-600">Years Experience</p>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="border-t border-gray-200/50 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Your Bookings</h2>
          <div className="flex space-x-2 bg-gray-100/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'upcoming' ? 'bg-yellow-400 text-gray-800' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'completed' ? 'bg-yellow-400 text-gray-800' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Completed ({completedBookings.length})
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/50">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Session Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'upcoming' ? (
                upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200/50 hover:bg-gray-50/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{booking.student?.name || 'Student'}</p>
                          <p className="text-sm text-gray-500">{booking.student?.email || 'No email'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800">{formatDate(booking.date)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleMarkComplete(booking.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Mark Complete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No upcoming bookings
                    </td>
                  </tr>
                )
              ) : (
                completedBookings.length > 0 ? (
                  completedBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200/50 hover:bg-gray-50/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{booking.student?.name || 'Student'}</p>
                          <p className="text-sm text-gray-500">{booking.student?.email || 'No email'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800">{formatDate(booking.date)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          COMPLETED
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400">Completed</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No completed bookings
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {bookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg backdrop-blur-sm">
              <div>
                <p className="font-medium text-gray-800">
                  {booking.status === 'CONFIRMED' 
                    ? `New booking from ${booking.student?.name || 'Student'}` 
                    : `Session completed with ${booking.student?.name || 'Student'}`
                  }
                </p>
                <p className="text-sm text-gray-500">{formatDate(booking.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.status === 'CONFIRMED' 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {booking.status === 'CONFIRMED' ? 'New' : 'Completed'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => router.push('/dashboard/availability')}
            className="px-4 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
          >
            Set Availability
          </button>
          <button 
            onClick={() => router.push('/dashboard/earnings')}
            className="px-4 py-3 bg-white/80 border border-yellow-300/50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50/50 transition-colors backdrop-blur-sm"
          >
            View Earnings
          </button>
          <button 
            onClick={() => router.push('/dashboard/profile')}
            className="px-4 py-3 bg-white/80 border border-yellow-300/50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50/50 transition-colors backdrop-blur-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Component
// Admin Dashboard Component
function AdminDashboard({ session }: { session: any }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Fetch admin dashboard stats
        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.data);
        }

        // Fetch recent users
        const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/users?limit=5`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setRecentUsers(usersData.data || []);
        }

        // Fetch recent bookings
        const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/bookings?limit=5`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setRecentBookings(bookingsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchAdminData();
    }
  }, [session]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Fetch fresh data
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
        },
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to ban this user?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/users/${userId}/ban`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state
        setRecentUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'BANNED' }
            : user
        ));
        
        // Update stats
        if (stats) {
          setStats(prev => prev ? {
            ...prev,
            users: {
              ...prev.users,
              banned: prev.users.banned + 1
            }
          } : prev);
        }
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to unban this user?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/users/${userId}/unban`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state
        setRecentUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'ACTIVE' }
            : user
        ));
        
        // Update stats
        if (stats) {
          setStats(prev => prev ? {
            ...prev,
            users: {
              ...prev.users,
              banned: Math.max(0, prev.users.banned - 1)
            }
          } : prev);
        }
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">System overview and management</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <div className="bg-gradient-to-br from-blue-50/80 to-white/80 p-6 rounded-xl border border-blue-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <UsersIcon className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-blue-600">Total Users</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.users.total || 0}</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {stats?.users.students || 0} Students
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              {stats?.users.tutors || 0} Tutors
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              {stats?.users.banned || 0} Banned
            </span>
          </div>
        </div>
        
        {/* Bookings Card */}
        <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <CalendarIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">Total Bookings</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.bookings.total || 0}</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              {stats?.bookings.confirmed || 0} Confirmed
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {stats?.bookings.completed || 0} Completed
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
              {stats?.bookings.cancelled || 0} Cancelled
            </span>
          </div>
        </div>
        
        {/* Tutors Card */}
        <div className="bg-gradient-to-br from-green-50/80 to-white/80 p-6 rounded-xl border border-green-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <AcademicCapIcon className="w-8 h-8 text-green-600" />
            <span className="text-sm text-green-600">Tutors</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.tutors.totalProfiles || 0}</h3>
          <div className="flex items-center mt-3">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <span className="ml-2 text-gray-600">
              Avg. Rating: <span className="font-semibold">{stats?.tutors.avgRating || 0}/5</span>
            </span>
          </div>
        </div>
        
        {/* Reviews Card */}
        <div className="bg-gradient-to-br from-purple-50/80 to-white/80 p-6 rounded-xl border border-purple-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <UserGroupIcon className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-purple-600">Reviews</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.reviews.total || 0}</h3>
          <p className="text-gray-600">Total feedback received</p>
        </div>
      </div>

      {/* Recent Users Section */}
      <div className="border-t border-gray-200/50 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Recent Users</h3>
          <button
            onClick={() => router.push('/admin/users')}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            View All Users →
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/50">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">User</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Joined</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200/50 hover:bg-gray-50/30">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'TUTOR'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-800">{formatDate(user.createdAt)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {user.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                            title="Ban User"
                          >
                            <XCircleIcon className="w-4 h-4" />
                            <span>Ban</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                            title="Unban User"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            <span>Unban</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Recent Bookings</h3>
          <button
            onClick={() => router.push('/admin/bookings')}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            View All Bookings →
          </button>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/50">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Session Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200/50 hover:bg-gray-50/30">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{booking.student?.name || 'Unknown Student'}</p>
                        <p className="text-sm text-gray-500">{booking.student?.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-800">{formatDate(booking.date)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-yellow-100 text-yellow-700'
                          : booking.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-800">{formatDate(booking.createdAt)}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Distribution */}
          <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50">
            <h4 className="font-semibold text-gray-800 mb-4">User Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Students</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{stats?.users.students || 0}</span>
                  <span className="text-sm text-blue-600">
                    ({stats?.users.total ? Math.round((stats.users.students / stats.users.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tutors</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{stats?.users.tutors || 0}</span>
                  <span className="text-sm text-yellow-600">
                    ({stats?.users.total ? Math.round((stats.users.tutors / stats.users.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Admins</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{stats?.users.admins || 0}</span>
                  <span className="text-sm text-purple-600">
                    ({stats?.users.total ? Math.round((stats.users.admins / stats.users.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50">
            <h4 className="font-semibold text-gray-800 mb-4">Booking Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Confirmed</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{stats?.bookings.confirmed || 0}</span>
                  <span className="text-sm text-yellow-600">
                    ({stats?.bookings.total ? Math.round((stats.bookings.confirmed / stats.bookings.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{stats?.bookings.completed || 0}</span>
                  <span className="text-sm text-green-600">
                    ({stats?.bookings.total ? Math.round((stats.bookings.completed / stats.bookings.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cancelled</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{stats?.bookings.cancelled || 0}</span>
                  <span className="text-sm text-red-600">
                    ({stats?.bookings.total ? Math.round((stats.bookings.cancelled / stats.bookings.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50">
            <h4 className="font-semibold text-gray-800 mb-4">System Health</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Active Users</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {(stats?.users.total || 0) - (stats?.users.banned || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600">Banned Users</span>
                </div>
                <span className="font-semibold text-gray-800">{stats?.users.banned || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600">Tutor Rating</span>
                </div>
                <span className="font-semibold text-gray-800">{stats?.tutors.avgRating || 0}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => router.push('/admin/users')}
            className="px-4 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            Manage Users
          </button>
          <button 
            onClick={() => router.push('/admin/analytics')}
            className="px-4 py-3 bg-white/80 border border-yellow-300/50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50/50 transition-colors backdrop-blur-sm"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'STUDENT';
  const navItems = getNavItems(userRole);
  const router = useRouter();

  // Check if desktop on mount and handle resize
  useEffect(() => {
    const checkScreenSize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsDesktop(isLargeScreen);
      if (isLargeScreen) {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
  };

  const renderDashboardContent = () => {
    if (!session) return null;
    
    switch (userRole) {
      case 'STUDENT':
        return <StudentDashboard session={session} />;
      case 'TUTOR':
        return <TutorDashboard session={session} />;
      case 'ADMIN':
        return <AdminDashboard session={session} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="flex relative">
        {/* Blur Overlay */}
        {sidebarOpen && !isDesktop && (
          <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky lg:top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-md shadow-xl 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 z-40 border-r border-gray-200/50
          `}
          style={{ height: 'calc(100vh)' }}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200/50 relative">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-gray-800" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Sk!lL<span className='text-yellow-400'>Bridge</span></h1>
                  <p className="text-xs text-yellow-600 font-medium">
                    {userRole.toLowerCase()}
                  </p>
                </div>
              </div>
              {/* Close button for mobile */}
              {!isDesktop && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100/50 rounded-lg backdrop-blur-sm"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <UserIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {session?.user?.name || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {session?.user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50/50 hover:text-gray-900 transition-all backdrop-blur-sm"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  );
                })}
              </div>

            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Welcome back, {session?.user?.name || 'User'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here is what is happening with your {userRole.toLowerCase()} account today.
              </p>
              
              {/* Mobile Toggle Button - Shows when sidebar is closed on mobile */}
              {!sidebarOpen && !isDesktop && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mt-4 px-4 py-2 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
                >
                  Open Dashboard Menu
                </button>
              )}
            </div>
            
            {/* Dashboard Content */}
            <div className={`
              bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50
              transition-all duration-300
              ${sidebarOpen && !isDesktop ? 'blur-sm scale-95' : 'blur-0 scale-100'}
            `}>
              {renderDashboardContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}