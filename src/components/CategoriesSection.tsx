
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  createdAt?: string;
  _count?: {
    tutors?: number;
  };
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Debug: API response দেখুন
        console.log('Categories API Response:', data);
        
        // Handle different response structures
        let categoriesData: Category[] = [];
        
        if (Array.isArray(data)) {
          categoriesData = data;
        } else if (data && typeof data === 'object' && data.data && Array.isArray(data.data)) {
          categoriesData = data.data;
        } else if (data && typeof data === 'object') {
          categoriesData = [data];
        } else if (data && data.categories && Array.isArray(data.categories)) {
          categoriesData = data.categories;
        }
        
        setCategories(categoriesData);
        
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        // Fallback test data
        setCategories([
          { id: '1', name: 'Mathematics' },
          { id: '2', name: 'Physics' },
          { id: '3', name: 'Chemistry' },
          { id: '4', name: 'Biology' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/tutors?category=${categoryId}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h2>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h2>
            <p className="text-gray-500">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse <span className="text-yellow-500">Categories</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of subjects and find the perfect tutor for your learning goals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <span className="text-sm text-gray-600">
                  {category._count?.tutors || 0} {category._count?.tutors === 1 ? 'Tutor' : 'Tutors'}
                </span>
                {category.createdAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/tutors')}
            className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          >
            View All Subjects
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}