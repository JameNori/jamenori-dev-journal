import { NavBar } from "../components/NavBar";
import { HeroSection } from "../components/HeroSection";
import ArticleSection from "../components/ArticleSection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </>
  );
}
