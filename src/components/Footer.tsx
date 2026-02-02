
'use client';

import { useRouter } from 'next/navigation';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <AcademicCapIcon className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold">
                Sk!lL<span className="text-yellow-400">Bridge</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              Expert tutoring for every learner. Book sessions with certified tutors today.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <button onClick={() => router.push('/tutors')} className="block hover:text-yellow-400">
                  Find Tutors
                </button>
                <button onClick={() => router.push('/dashboard')} className="block hover:text-yellow-400">
                  Dashboard
                </button>
                <button onClick={() => router.push('/about')} className="block hover:text-yellow-400">
                  About Us
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <button onClick={() => router.push('/help')} className="block hover:text-yellow-400">
                  Help Center
                </button>
                <button onClick={() => router.push('/contact')} className="block hover:text-yellow-400">
                  Contact Us
                </button>
                <button onClick={() => router.push('/privacy')} className="block hover:text-yellow-400">
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Contact Info</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>Email: support@skillbridge.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>24/7 Support Available</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Sk!lLBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}