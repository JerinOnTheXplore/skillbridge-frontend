"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function TutorsViewToggle() {
  const router = useRouter();
  const params = useSearchParams();

  const setView = (v: string) => {
    const p = new URLSearchParams(params.toString());
    p.set("view", v);
    router.push(`/tutors?${p.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => setView("grid")}>⬛</button>
      <button onClick={() => setView("list")}>☰</button>
    </div>
  );
}
