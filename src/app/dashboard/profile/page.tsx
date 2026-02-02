'use client';

import { useSession } from 'next-auth/react';
import StudentProfilePage from '@/components/profile/StudentProfilePage';
import TutorProfilePage from '@/components/profile/TutorProfilePage';


export default function ProfilePage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'STUDENT';

  switch (userRole) {
    case 'STUDENT':
      return <StudentProfilePage />;
    case 'TUTOR':
      return <TutorProfilePage />;
    case 'ADMIN':
    //   return <AdminProfilePage />;
    default:
      return <StudentProfilePage />;
  }
}