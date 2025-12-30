import Navbar from "../../features/home/Navbar";
import HeroSection from "../../features/home/HeroSection";
import AboutSection from "../../features/home/AboutSection";
import ContactSection from "../../features/home/ContactSection";
import Footer from "../../features/home/Footer";
import ScrollToTop from "../../features/home/ScrollToTop";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ContactSection />
      <ScrollToTop />
      <Footer />
      
    </>
  );
};

export default Home;
