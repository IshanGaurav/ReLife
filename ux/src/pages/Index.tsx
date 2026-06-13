import { useState, useEffect } from 'react';import "@/styles/home.css";
import AboutSection from "@/components/Index/AboutSection";
import AmazonBar from "@/components/Index/AmazonBar";
import EditorialSection from "@/components/Index/EditorialSection";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/Index/HeroSection";
import InspectionSection from "@/components/Index/InspectionSection";
import Navigation from "@/components/layout/Navigation";
import NewsletterSection from "@/components/Index/NewsletterSection";
import ProductsGrid from "@/components/Index/ProductsGrid";

const Index = () => {
  const [heroLoaded, setHeroLoaded] = useState<boolean>(false);
  const [savingsBarWidth, setSavingsBarWidth] = useState<string>("0%");
  const [ecoMarkerLeft, setEcoMarkerLeft] = useState<string>("0%");
  const [savingsPercent, setSavingsPercent] = useState<number>(0);

  // Animate savings bar on mount
  useEffect(() => {
    setHeroLoaded(true);
    setSavingsBarWidth('69.4%');
    setEcoMarkerLeft('69.4%');
    setSavingsPercent(31);
  }, []);


  return (
    <div className="bg-cream antialiased">

      <AmazonBar />
      <Navigation />
      <HeroSection heroLoaded={heroLoaded} />
      <EditorialSection />
      <InspectionSection />
      <ProductsGrid savingsBarWidth={savingsBarWidth} ecoMarkerLeft={ecoMarkerLeft} savingsPercent={savingsPercent} />
      <AboutSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
