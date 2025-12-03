import { UserNavBar } from "../components/UserNavBar";
import { HeroSection } from "../components/HeroSection";
import ArticleSection from "../components/ArticleSection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <>
      <UserNavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </>
  );
}
