import { Tutor } from '@/types/tutor';

export async function getFeaturedTutors(limit = 3): Promise<Tutor[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/tutors?limit=${limit}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch tutors');
  }

  const data = await res.json();

  // assuming backend returns { data: Tutor[] }
  return data.data;
}
