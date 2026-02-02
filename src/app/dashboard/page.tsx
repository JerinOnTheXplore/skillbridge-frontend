'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
} from '@heroicons/react/24/outline';

// Navigation items based on role
const getNavItems = (role: string) => {
  const common = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  ];

  if (role === 'STUDENT') {
    return [
      ...common,
      { name: 'My Bookings', href: '/dashboard/bookings', icon: CalendarIcon },
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
      { name: 'All Bookings', href: '/admin/bookings', icon: BookOpenIcon },
      { name: 'Categories', href: '/admin/categories', icon: CogIcon },
      { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    ];
  }

  return common;
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'STUDENT';
  const navItems = getNavItems(userRole);

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
                  const isActive = false;
                  
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                        backdrop-blur-sm
                        ${isActive 
                          ? 'bg-yellow-50/80 text-yellow-600 border-l-4 border-yellow-400' 
                          : 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  );
                })}
              </div>

              {/* Settings */}
              <div className="mt-8">
                <a
                  href="/dashboard/settings"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50/50 backdrop-blur-sm"
                >
                  <CogIcon className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </a>
              </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200/50">
              <button className="flex items-center justify-center w-full space-x-3 px-4 py-3 
                       bg-gray-50/50 text-gray-700 rounded-xl hover:bg-gray-100/50 
                       transition-colors backdrop-blur-sm">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Dashboard
              </h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <CalendarIcon className="w-8 h-8 text-yellow-600" />
                    <span className="text-sm text-yellow-600">+2 today</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">12</h3>
                  <p className="text-gray-600">Total Sessions</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <StarIcon className="w-8 h-8 text-yellow-600" />
                    <span className="text-sm text-yellow-600">0.1↑</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">4.8</h3>
                  <p className="text-gray-600">Average Rating</p>
                </div>
                
                {userRole === 'TUTOR' && (
                  <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <ChartBarIcon className="w-8 h-8 text-yellow-600" />
                      <span className="text-sm text-yellow-600">+$320</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">$2,850</h3>
                    <p className="text-gray-600">Total Earnings</p>
                  </div>
                )}
                
                {userRole === 'STUDENT' && (
                  <div className="bg-gradient-to-br from-yellow-50/80 to-white/80 p-6 rounded-xl border border-yellow-100/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <AcademicCapIcon className="w-8 h-8 text-yellow-600" />
                      <span className="text-sm text-yellow-600">1 new</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">3</h3>
                    <p className="text-gray-600">Active Tutors</p>
                  </div>
                )}
              </div>
              
              {/* Recent Activity */}
              <div className="border-t border-gray-200/50 pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg backdrop-blur-sm">
                      <div>
                        <p className="font-medium text-gray-800">
                          {userRole === 'STUDENT' && 'Math session completed'}
                          {userRole === 'TUTOR' && 'New booking received'}
                          {userRole === 'ADMIN' && 'New user registered'}
                        </p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100/80 text-yellow-700 rounded-full text-sm font-medium backdrop-blur-sm">
                        {userRole === 'STUDENT' && 'Completed'}
                        {userRole === 'TUTOR' && 'New'}
                        {userRole === 'ADMIN' && 'New'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200/50">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                  {userRole === 'STUDENT' && (
                    <>
                      <button className="px-4 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm">
                        Book New Session
                      </button>
                      <button className="px-4 py-3 bg-white/80 border border-yellow-300/50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50/50 transition-colors backdrop-blur-sm">
                        Browse Tutors
                      </button>
                    </>
                  )}
                  {userRole === 'TUTOR' && (
                    <>
                      <button className="px-4 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm">
                        Set Availability
                      </button>
                      <button className="px-4 py-3 bg-white/80 border border-yellow-300/50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50/50 transition-colors backdrop-blur-sm">
                        View Earnings
                      </button>
                    </>
                  )}
                  {userRole === 'ADMIN' && (
                    <>
                      <button className="px-4 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm">
                        Manage Users
                      </button>
                      <button className="px-4 py-3 bg-white/80 border border-yellow-300/50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50/50 transition-colors backdrop-blur-sm">
                        View Analytics
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}