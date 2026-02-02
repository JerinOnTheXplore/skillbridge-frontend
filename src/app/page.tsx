import CategoriesSection from "@/components/CategoriesSection";
import FeaturedTutors from "@/components/featured-tutors";
import Hero from "@/components/hero";
import SubjectsSection from "@/components/SubjectsSection";


export default function Home() {
  return (
    <>
       <Hero/>
       <FeaturedTutors/>
       <CategoriesSection/>
       <SubjectsSection/>
    </>
  );
}
