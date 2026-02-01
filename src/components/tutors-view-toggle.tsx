"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CgMenuGridO } from "react-icons/cg";
import { TiThListOutline } from "react-icons/ti";

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
      <button className="bg-gray-500 rounded-full p-3" onClick={() => setView("grid")}><CgMenuGridO /></button>
      <button className="bg-gray-500 rounded-full p-3" onClick={() => setView("list")}><TiThListOutline /></button>
    </div>
  );
}
