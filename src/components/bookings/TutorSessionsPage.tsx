'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  CalendarIcon,
  CheckCircleIcon,
  StarIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function SessionsPage() {
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // Fetch completed sessions
  useEffect(() => {
    const fetchCompletedSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/tutor`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter only COMPLETED bookings
          const completed = (data.data || []).filter((booking: any) => booking.status === 'COMPLETED');
          setCompletedSessions(completed);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchCompletedSessions();
    }
  }, [session]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
            My Sessions
          </h1>
          <p className="text-gray-600 mt-2">
            View all your completed teaching sessions
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <CalendarIcon className="w-8 h-8 text-yellow-600" />
              <span className="text-sm text-yellow-600">{completedSessions.length} total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{completedSessions.length}</h3>
            <p className="text-gray-600">Completed Sessions</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <ClockIcon className="w-8 h-8 text-yellow-600" />
              <span className="text-sm text-yellow-600">Average</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{completedSessions.length * 1}</h3>
            <p className="text-gray-600">Total Hours</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <StarIcon className="w-8 h-8 text-yellow-600" />
              <span className="text-sm text-yellow-600">Rating</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">4.8</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Completed Sessions</h2>
            <p className="text-gray-600 text-sm">
              All your past teaching sessions
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {completedSessions.length > 0 ? (
              completedSessions.map((session) => (
                <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          Session with {session.student?.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{formatDate(session.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">COMPLETED</span>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">
                          Student Email: {session.student?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-5 h-5 ${
                                star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-800 font-medium">4.8</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Session ID</p>
                        <p className="text-gray-800 font-mono text-sm">{session.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed sessions yet</h3>
                <p className="text-gray-500">
                  Your completed teaching sessions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}