'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';

export default function EarningsPage() {
  const [earningsData, setEarningsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const { data: session } = useSession();

  // Fetch earnings data
  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        // Fetch tutor profile for hourly rate
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tutors/profile/me`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        // Fetch completed bookings
        const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/tutor`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (profileResponse.ok && bookingsResponse.ok) {
          const profileData = await profileResponse.json();
          const bookingsData = await bookingsResponse.json();
          
          const completedBookings = (bookingsData.data || []).filter((b: any) => b.status === 'COMPLETED');
          const hourlyRate = profileData.data?.hourlyRate || 0;
          
          // Calculate earnings
          const totalEarnings = completedBookings.length * hourlyRate;
          const monthlyEarnings = completedBookings.length * hourlyRate * 0.3;
          
          // Generate monthly data
          const monthlyData = [
            { month: 'Jan', earnings: monthlyEarnings * 0.8 },
            { month: 'Feb', earnings: monthlyEarnings * 0.9 },
            { month: 'Mar', earnings: monthlyEarnings },
            { month: 'Apr', earnings: monthlyEarnings * 1.1 },
            { month: 'May', earnings: monthlyEarnings * 1.2 },
            { month: 'Jun', earnings: monthlyEarnings * 1.3 },
          ];
          
          setEarningsData({
            totalEarnings,
            hourlyRate,
            totalSessions: completedBookings.length,
            monthlyData,
            recentTransactions: completedBookings.slice(0, 5).map((booking: any) => ({
              id: booking.id,
              student: booking.student?.name,
              date: booking.date,
              amount: hourlyRate,
              status: 'Paid'
            }))
          });
        }
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchEarningsData();
    }
  }, [session]);

  // Handle Download Report
  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      
      // Create CSV data
      const csvData = [
        ['Transaction ID', 'Student Name', 'Date', 'Amount', 'Status'],
        ...(earningsData?.recentTransactions || []).map((t: any) => [
          t.id.substring(0, 8) + '...',
          t.student,
          new Date(t.date).toLocaleDateString(),
          `$${t.amount}`,
          t.status
        ])
      ];
      
      // Convert to CSV string
      const csvString = csvData.map(row => row.join(',')).join('\n');
      
      // Create blob and download
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `earnings-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Show success toast
      toast.success('Report downloaded successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
        },
        icon: '📊',
      });
      
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setDownloading(false);
    }
  };

  // Handle Request Payout
  const handleRequestPayout = async () => {
    if (!earningsData?.totalEarnings || earningsData.totalEarnings < 50) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-yellow-50 border border-yellow-200 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CurrencyDollarIcon className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Minimum Payout Required
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Minimum payout amount is $50. Current balance: ${earningsData?.totalEarnings || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-yellow-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-600 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-right',
      });
      return;
    }

    try {
      setRequestingPayout(true);
      
      // Show loading toast
      const loadingToast = toast.loading('Processing payout request...', {
        position: 'top-right',
      });
      
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/payouts/request`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${session?.accessToken || ''}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     amount: earningsData.totalEarnings,
      //   }),
      // });
      
      //  simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToast);
      
      toast.success(
        <div className="space-y-2">
          <div className="font-semibold">Payout Request Submitted!</div>
          <div className="text-sm">
            Amount: <span className="font-bold">${earningsData.totalEarnings}</span><br />
            Expected processing: 3-5 business days
          </div>
        </div>,
        {
          duration: 6000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
          },
          icon: '💰',
        }
      );
      
    } catch (error) {
      console.error('Error requesting payout:', error);
      toast.error('Failed to request payout. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setRequestingPayout(false);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* React Hot Toast Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
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
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#FBBF24',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Earnings
            </h1>
            <p className="text-gray-600 mt-2">
              Track your earnings and financial performance
            </p>
          </div>
          <button 
            onClick={handleDownloadReport}
            disabled={downloading}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <CurrencyDollarIcon className="w-8 h-8 text-yellow-600" />
              <span className="flex items-center text-sm text-green-600">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                12% from last month
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {formatCurrency(earningsData?.totalEarnings || 0)}
            </h3>
            <p className="text-gray-600">Total Earnings</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-yellow-600" />
              <span className="text-sm text-yellow-600">${earningsData?.hourlyRate || 0}/hr</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{earningsData?.totalSessions || 0}</h3>
            <p className="text-gray-600">Completed Sessions</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <ArrowTrendingUpIcon className="w-8 h-8 text-yellow-600" />
              <span className="text-sm text-yellow-600">Average per session</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {formatCurrency(earningsData?.hourlyRate || 0)}
            </h3>
            <p className="text-gray-600">Session Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earnings Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Monthly Earnings</h2>
              <span className="text-sm text-gray-500">Last 6 months</span>
            </div>
            
            <div className="h-64 flex items-end space-x-4">
              {earningsData?.monthlyData?.map((month: any, index: number) => (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-yellow-400 rounded-t-lg transition-all hover:bg-yellow-500"
                      style={{ height: `${(month.earnings / (earningsData.totalEarnings || 1)) * 200}px` }}
                    ></div>
                    <div className="absolute bottom-0 left-0 right-0 text-center">
                      <span className="text-xs text-gray-600">{month.month}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-800">
                      {formatCurrency(month.earnings)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
            
            <div className="space-y-4">
              {earningsData?.recentTransactions?.length > 0 ? (
                earningsData.recentTransactions.map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{transaction.student}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatCurrency(transaction.amount)}</p>
                      <span className="text-sm text-green-600 font-medium">{transaction.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CurrencyDollarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No transactions yet</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total This Month</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(earningsData?.monthlyData?.[earningsData.monthlyData.length - 1]?.earnings || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Expected Payout</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency((earningsData?.totalEarnings || 0) * 0.85)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Payout Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Next Payout Date</p>
              <p className="text-lg font-bold text-gray-800">February 15, 2026</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Payout Method</p>
              <p className="text-lg font-bold text-gray-800">Bank Transfer</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Payout Frequency</p>
              <p className="text-lg font-bold text-gray-800">Monthly</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Available for payout</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(earningsData?.totalEarnings || 0)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Minimum payout amount: $50
                </p>
              </div>
              <button 
                onClick={handleRequestPayout}
                disabled={requestingPayout || (earningsData?.totalEarnings || 0) < 50}
                className="px-6 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requestingPayout ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Request Payout'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}