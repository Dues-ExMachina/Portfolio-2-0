import HeroSection from "@/components/home/HeroSection";
import FeaturedWorksGrid from "@/components/home/FeaturedWorksGrid";
import PortfolioSpotlight from "@/components/home/PortfolioSpotlight";
import FeaturedProject from "@/components/home/FeaturedProject";
import CTAStripe from "@/components/home/CTAStripe";
import BottomProjectsGrid from "@/components/home/BottomProjectsGrid";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedWorksGrid />
      <PortfolioSpotlight />
      <FeaturedProject />
      <CTAStripe />
      <BottomProjectsGrid />
      <Footer />
    </>
  );
}
