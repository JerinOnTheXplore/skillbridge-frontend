'use client';

import { useSession } from 'next-auth/react';
import { Suspense } from 'react';
import StudentReviewsPage from '@/components/reviews/StudentReviewsPage';
import TutorReviewsPage from '@/components/reviews/TutorReviewsPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';


function ReviewsContent() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'STUDENT';

  switch (userRole) {
    case 'STUDENT':
      return <StudentReviewsPage />;
    case 'TUTOR':
      return <TutorReviewsPage />;
    default:
      return <StudentReviewsPage />;
  }
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<LoadingSpinner/>}>
      <ReviewsContent />
    </Suspense>
  );
}