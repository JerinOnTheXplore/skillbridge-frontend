"use client";
interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function TutorsSearch({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="Search by name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  );
}
