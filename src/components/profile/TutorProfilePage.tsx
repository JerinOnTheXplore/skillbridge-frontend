'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  PencilIcon,
  StarIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function TutorProfilePage() {
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: 0,
    experience: 0,
  });
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch tutor profile data
  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tutors/profile/me`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setTutorProfile(data.data || {});
          setFormData({
            bio: data.data?.bio || '',
            hourlyRate: data.data?.hourlyRate || 0,
            experience: data.data?.experience || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching tutor profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchTutorProfile();
    }
  }, [session]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tutors/profile/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setTutorProfile(updatedData.data);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                My Profile
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your tutor profile and information
              </p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
              <span>{editing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-gray-800">{tutorProfile?.rating || 0}/5</span>
                </div>
              </div>
              
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Tell students about yourself, your teaching style, and experience..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate ($)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                          placeholder="25"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: Number(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder="5"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {tutorProfile?.bio || 'No bio added yet.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CurrencyDollarIcon className="w-8 h-8 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-600">Hourly Rate</p>
                          <p className="text-2xl font-bold text-gray-800">${tutorProfile?.hourlyRate || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="w-8 h-8 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="text-2xl font-bold text-gray-800">{tutorProfile?.experience || 0} years</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <StarIcon className="w-8 h-8 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <p className="text-2xl font-bold text-gray-800">{tutorProfile?.rating || 0}/5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Categories Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Subjects I Teach</h2>
              <div className="flex flex-wrap gap-3">
                {tutorProfile?.categories?.length > 0 ? (
                  tutorProfile.categories.map((category: any) => (
                    <span
                      key={category.id}
                      className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-medium"
                    >
                      {category.name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No subjects added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Stats</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <UserGroupIcon className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-xl font-bold text-gray-800">15</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AcademicCapIcon className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Completed Sessions</p>
                      <p className="text-xl font-bold text-gray-800">48</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-xl font-bold text-gray-800">$2,850</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Completion</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Profile Details</span>
                    <span className="text-sm font-medium text-gray-700">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${tutorProfile?.bio ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-600">Add bio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${tutorProfile?.hourlyRate ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-600">Set hourly rate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-sm text-gray-600">Add subjects (2/5)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}