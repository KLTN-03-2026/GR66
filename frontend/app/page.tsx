
import Image from "next/image";
import IntroSection from "@/components/Introsection";
import ServiceSection from "@/components/Servicesection";
import GallerySection from "@/components/Gallerysection";

export default function Home() {
  return (
    <div>
      <IntroSection />
      <ServiceSection />
      <GallerySection />
    </div>
  );
}
