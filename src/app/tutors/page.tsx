import { Suspense } from "react";
import TutorsPageClient from "./tutors-page-client";

export default function TutorsPage() {
  return (
    <Suspense fallback={<div>Loading tutors...</div>}>
      <TutorsPageClient />
    </Suspense>
  );
}
