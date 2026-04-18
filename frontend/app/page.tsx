
import Image from "next/image";
import IntroSection from "@/components/Introsection";
import ServiceSection from "@/components/Servicesection";
import GallerySection from "@/components/Gallerysection";
import ActivitySection from "@/components/Activitysection";
import TimeSection from "@/components/Timesection";
import SuggestionSection from "@/components/Suggestionsection";
import ReasonSection from "@/components/Reasonsection";
import BenefitSection from "@/components/Benefitsection";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div>
      <IntroSection />
      <ServiceSection />
      <GallerySection />
      <ActivitySection />
      <TimeSection />
      <SuggestionSection />
      <ReasonSection />
      <BenefitSection />
      <Footer />
    </div>
  );
}
