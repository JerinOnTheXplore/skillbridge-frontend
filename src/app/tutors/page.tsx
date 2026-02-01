"use client";

import FeaturedTutorsSide from "@/components/featured-tutors-side";
import TutorsFilters from "@/components/tutors-filters";
import TutorsList from "@/components/tutors-list";
import TutorsSearch from "@/components/tutors-search";
import TutorsViewToggle from "@/components/tutors-view-toggle";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";


export default function TutorsPage() {
  const [search, setSearch] = useState("");
  const params = useSearchParams();
  const view = params.get("view") || "grid";

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Tutors</h1>

        <div className="grid lg:grid-cols-[240px_1fr_280px] gap-8">
          {/* LEFT FILTERS */}
          <TutorsFilters />
          {/* CENTER */}
          <div>
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <TutorsSearch search={search} setSearch={setSearch} />
              <TutorsViewToggle />
            </div>
          </div>

          {/* RIGHT FEATURED */}
        </div>
        <div className="flex  max-w-7xl">
          <TutorsList view={view} />
          <FeaturedTutorsSide />
        </div>
      </div>
    </section>
  );
}
