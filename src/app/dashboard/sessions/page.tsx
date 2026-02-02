'use client';

import { useSession } from 'next-auth/react';
import StudentBookingsPage from '@/components/bookings/StudentBookingsPage';
import TutorSessionsPage from '@/components/bookings/TutorSessionsPage';
import AdminBookingsPage from '@/components/bookings/AdminBookingsPage';


export default function BookingsPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'STUDENT';

  // Role-based rendering
  switch (userRole) {
    case 'STUDENT':
      return <StudentBookingsPage />;
    case 'TUTOR':
      return <TutorSessionsPage />;
    case 'ADMIN':
      return <AdminBookingsPage/>;
    default:
      return <StudentBookingsPage />;
  }
}