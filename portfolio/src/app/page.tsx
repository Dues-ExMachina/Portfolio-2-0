import HeroSection from "@/components/home/HeroSection";
import FeaturedWorksGrid from "@/components/home/FeaturedWorksGrid";
import SkyWatchShowcase from "@/components/home/SkyWatchShowcase";
import PortfolioSpotlight from "@/components/home/PortfolioSpotlight";
import FeaturedProject from "@/components/home/FeaturedProject";
import CTAStripe from "@/components/home/CTAStripe";
import BottomProjectsGrid from "@/components/home/BottomProjectsGrid";
import CurrentRole from "@/components/CurrentRole";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CurrentRole className="bg-navy-secondary" />
      <FeaturedWorksGrid />
      <SkyWatchShowcase />
      <PortfolioSpotlight />
      <FeaturedProject />
      <CTAStripe />
      <BottomProjectsGrid />
      <Footer />
    </>
  );
}
