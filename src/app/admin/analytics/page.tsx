'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueChange: number;
    activeUsers: number;
    userChange: number;
    totalSessions: number;
    sessionChange: number;
    avgRating: number;
    ratingChange: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    sessions: number;
  }>;
  userGrowth: Array<{
    month: string;
    students: number;
    tutors: number;
    total: number;
  }>;
  tutorStats: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  popularSubjects: Array<{
    subject: string;
    bookings: number;
    revenue: number;
  }>;
  timeDistribution: Array<{
    timeSlot: string;
    bookings: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const { data: session } = useSession();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/admin/analytics?range=${timeRange}`,
          {
            headers: {
              'Authorization': `Bearer ${session?.accessToken || ''}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data.data);
        } else {
          // Fallback to mock data if API fails
          setAnalyticsData(getMockAnalyticsData());
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Fallback to mock data
        setAnalyticsData(getMockAnalyticsData());
      } finally {
        setLoading(false);
      }
    };
    
    if (session?.accessToken) {
      fetchAnalytics();
    }
  }, [session, timeRange]);

  // Mock data function for development
  const getMockAnalyticsData = (): AnalyticsData => ({
    overview: {
      totalRevenue: 45670,
      revenueChange: 12.5,
      activeUsers: 125,
      userChange: 8.2,
      totalSessions: 3456,
      sessionChange: 15.3,
      avgRating: 4.2,
      ratingChange: 0.3,
    },
    monthlyRevenue: [
      { month: 'Jan', revenue: 4000, sessions: 240 },
      { month: 'Feb', revenue: 4500, sessions: 280 },
      { month: 'Mar', revenue: 5000, sessions: 320 },
      { month: 'Apr', revenue: 4800, sessions: 300 },
      { month: 'May', revenue: 5200, sessions: 340 },
      { month: 'Jun', revenue: 5500, sessions: 360 },
      { month: 'Jul', revenue: 6000, sessions: 400 },
    ],
    userGrowth: [
      { month: 'Jan', students: 40, tutors: 10, total: 50 },
      { month: 'Feb', students: 45, tutors: 12, total: 57 },
      { month: 'Mar', students: 50, tutors: 15, total: 65 },
      { month: 'Apr', students: 55, tutors: 18, total: 73 },
      { month: 'May', students: 60, tutors: 20, total: 80 },
      { month: 'Jun', students: 65, tutors: 22, total: 87 },
      { month: 'Jul', students: 70, tutors: 25, total: 95 },
    ],
    tutorStats: [
      { category: 'Beginner (<1 year)', count: 15, percentage: 30 },
      { category: 'Intermediate (1-3 years)', count: 25, percentage: 50 },
      { category: 'Advanced (3-5 years)', count: 8, percentage: 16 },
      { category: 'Expert (5+ years)', count: 2, percentage: 4 },
    ],
    popularSubjects: [
      { subject: 'Mathematics', bookings: 1200, revenue: 18000 },
      { subject: 'Physics', bookings: 900, revenue: 13500 },
      { subject: 'Chemistry', bookings: 750, revenue: 11250 },
      { subject: 'Biology', bookings: 600, revenue: 9000 },
      { subject: 'Computer Science', bookings: 450, revenue: 6750 },
    ],
    timeDistribution: [
      { timeSlot: 'Morning (8-12)', bookings: 450 },
      { timeSlot: 'Afternoon (12-4)', bookings: 600 },
      { timeSlot: 'Evening (4-8)', bookings: 850 },
      { timeSlot: 'Night (8-12)', bookings: 300 },
    ],
  });

  const exportToPDF = () => {
    // In a real app, this would generate a PDF report
    alert('PDF export feature would be implemented here');
  };

  const exportToCSV = () => {
    if (!analyticsData) return;
    
    const headers = ['Metric', 'Value', 'Change'];
    const overviewData = [
      ['Total Revenue', `$${analyticsData.overview.totalRevenue}`, `${analyticsData.overview.revenueChange}%`],
      ['Active Users', analyticsData.overview.activeUsers, `${analyticsData.overview.userChange}%`],
      ['Total Sessions', analyticsData.overview.totalSessions, `${analyticsData.overview.sessionChange}%`],
      ['Average Rating', analyticsData.overview.avgRating, `${analyticsData.overview.ratingChange}%`],
    ];
    
    const csvContent = [
      headers.join(','),
      ...overviewData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-30 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sk!lL<span className="text-yellow-400">Bridge</span></h1>
            <p className="text-sm text-gray-500">Analytics Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{session.user?.name || 'Admin'}</span>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">System Analytics</h1>
                <p className="text-gray-600 mt-2">Comprehensive insights and performance metrics</p>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 lg:mt-0">
                {/* Time Range Selector */}
                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportToPDF}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    <span>PDF Report</span>
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-gradient-to-br from-blue-50/80 to-white/80 p-6 rounded-xl border border-blue-100/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
                <div className={`flex items-center ${analyticsData!.overview.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData!.overview.revenueChange >= 0 ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {analyticsData!.overview.revenueChange >= 0 ? '+' : ''}
                    {analyticsData!.overview.revenueChange}%
                  </span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                ${analyticsData!.overview.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-gray-600">Total Revenue</p>
            </div>

            {/* Users Card */}
            <div className="bg-gradient-to-br from-green-50/80 to-white/80 p-6 rounded-xl border border-green-100/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <UsersIcon className="w-8 h-8 text-green-600" />
                <div className={`flex items-center ${analyticsData!.overview.userChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData!.overview.userChange >= 0 ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {analyticsData!.overview.userChange >= 0 ? '+' : ''}
                    {analyticsData!.overview.userChange}%
                  </span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {analyticsData!.overview.activeUsers.toLocaleString()}
              </h3>
              <p className="text-gray-600">Active Users</p>
            </div>

            {/* Sessions Card */}
            <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <CalendarIcon className="w-8 h-8 text-yellow-600" />
                <div className={`flex items-center ${analyticsData!.overview.sessionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData!.overview.sessionChange >= 0 ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {analyticsData!.overview.sessionChange >= 0 ? '+' : ''}
                    {analyticsData!.overview.sessionChange}%
                  </span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {analyticsData!.overview.totalSessions.toLocaleString()}
              </h3>
              <p className="text-gray-600">Total Sessions</p>
            </div>

            {/* Rating Card */}
            <div className="bg-gradient-to-br from-purple-50/80 to-white/80 p-6 rounded-xl border border-purple-100/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <StarIcon className="w-8 h-8 text-purple-600" />
                <div className={`flex items-center ${analyticsData!.overview.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData!.overview.ratingChange >= 0 ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {analyticsData!.overview.ratingChange >= 0 ? '+' : ''}
                    {analyticsData!.overview.ratingChange}%
                  </span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {analyticsData!.overview.avgRating.toFixed(1)}
              </h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Trend Chart */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Revenue Trend</h3>
                  <p className="text-gray-600">Monthly revenue and sessions</p>
                </div>
                <CurrencyDollarIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData!.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `$${value}` : value,
                        name === 'revenue' ? 'Revenue' : 'Sessions'
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue"
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      name="Sessions"
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">User Growth</h3>
                  <p className="text-gray-600">Monthly user acquisition</p>
                </div>
                <UserGroupIcon className="w-6 h-6 text-green-500" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData!.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={12}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        value,
                        name === 'students' ? 'Students' : 
                        name === 'tutors' ? 'Tutors' : 'Total Users'
                      ]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="students" 
                      name="Students" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="tutors" 
                      name="Tutors" 
                      fill="#10B981" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Second Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Tutor Experience Distribution */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Tutor Experience</h3>
                  <p className="text-gray-600">Distribution by experience level</p>
                </div>
                <AcademicCapIcon className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
  <Pie
    data={analyticsData!.tutorStats}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
    outerRadius={80}
    fill="#8884d8"
    dataKey="count"
  >
    {analyticsData!.tutorStats.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip 
    formatter={(value, name, props) => [
      `${value} tutors (${(props.payload as any).percentage}%)`,
      'Count'
    ]}
  />
</PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {analyticsData!.tutorStats.map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600 truncate">{stat.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Subjects */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Popular Subjects</h3>
                  <p className="text-gray-600">Most booked subjects</p>
                </div>
                <ChartBarIcon className="w-6 h-6 text-purple-500" />
              </div>
              <div className="space-y-4">
                {analyticsData!.popularSubjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-800">{subject.subject}</span>
                        <span className="text-sm text-gray-600">
                          ${subject.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ 
                            width: `${(subject.bookings / analyticsData!.popularSubjects[0].bookings) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">
                          {subject.bookings} bookings
                        </span>
                        <span className="text-sm text-gray-500">
                          {((subject.bookings / analyticsData!.popularSubjects.reduce((acc, curr) => acc + curr.bookings, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Distribution */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Session Timing</h3>
                  <p className="text-gray-600">Booking distribution by time of day</p>
                </div>
                <ClockIcon className="w-6 h-6 text-red-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData!.timeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timeSlot" 
                      stroke="#666" 
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={12}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} bookings`, 'Bookings']}
                    />
                    <Bar 
                      dataKey="bookings" 
                      name="Bookings" 
                      fill="#EF4444" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Peak booking time: <span className="font-semibold">Evening (4-8 PM)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${(analyticsData!.overview.totalRevenue / analyticsData!.overview.totalSessions).toFixed(2)}
                </div>
                <p className="text-gray-600">Average Revenue per Session</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(analyticsData!.overview.activeUsers / analyticsData!.userGrowth[analyticsData!.userGrowth.length - 1].total * 100)}%
                </div>
                <p className="text-gray-600">Active User Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {Math.round(analyticsData!.overview.totalSessions / analyticsData!.overview.activeUsers)}
                </div>
                <p className="text-gray-600">Avg. Sessions per User</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analyticsData!.popularSubjects.length}
                </div>
                <p className="text-gray-600">Active Subjects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}