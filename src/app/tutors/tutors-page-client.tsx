"use client";

import FeaturedTutorsSide from "@/components/featured-tutors-side";
import TutorsFilters from "@/components/tutors-filters";
import TutorsList from "@/components/tutors-list";
import TutorsSearch from "@/components/tutors-search";
import TutorsViewToggle from "@/components/tutors-view-toggle";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


export default function TutorsPage() {
  const [search, setSearch] = useState("");
  const params = useSearchParams();
  const view = params.get("view") || "grid";

  return (
    <section className="py-24 md:py-36 overflow-x-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl text-gray-700 text-center font-bold mb-8">Our <span className="text-yellow-400">Tutors</span></h1>

        <div className="grid lg:grid-cols-3 gap-8 pt-8">
          {/* LEFT FILTERS */}
            <TutorsFilters />
          
          {/* CENTER */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
              <TutorsSearch search={search} setSearch={setSearch} />
              <TutorsViewToggle />
            </div>

          {/* RIGHT FEATURED */}
        </div>
        <div className="flex justify-between gap-4 px-4 mt-20">
          <TutorsList view={view} />
          <FeaturedTutorsSide />
        </div>
      </div>
    </section>
  );
}
