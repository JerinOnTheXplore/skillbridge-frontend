'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  tutor?: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/bookings`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data.data || []);
          setFilteredBookings(data.data || []);
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

  useEffect(() => {
    let filtered = [...bookings];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.student.name.toLowerCase().includes(term) || 
        booking.student.email.toLowerCase().includes(term) ||
        (booking.tutor?.user.name.toLowerCase().includes(term) || false)
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Bookings Management</h1>
              <p className="text-gray-600 mt-2">Manage all bookings in the system</p>
            </div>
            <div className="flex gap-4 mt-4 lg:mt-0">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">Total Bookings</span>
                <CalendarIcon className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{bookings.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-yellow-700 font-medium">Confirmed</span>
                <ClockIcon className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {bookings.filter(b => b.status === 'CONFIRMED').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium">Completed</span>
                <EyeIcon className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {bookings.filter(b => b.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-red-700 font-medium">Cancelled</span>
                <CalendarIcon className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {bookings.filter(b => b.status === 'CANCELLED').length}
              </p>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Tutor</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Session Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Created</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200/50 hover:bg-gray-50/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{booking.student.name}</p>
                          <p className="text-sm text-gray-500">{booking.student.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{booking.tutor?.user.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{booking.tutor?.user.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800">{formatDate(booking.date)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800">{formatDate(booking.createdAt)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No bookings found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination/Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-gray-600 mb-4 sm:mb-0">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}