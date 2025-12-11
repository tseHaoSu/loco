"use client";

import { useState } from "react";
import {
  AnimatedBackground,
  Navigation,
  HeroSection,
  FeaturesSection,
  ScreenshotsSection,
  TestimonialsSection,
  CTASection,
  Footer,
} from "./components";

export const LandingView = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      <AnimatedBackground mousePosition={mousePosition} />
      <Navigation />
      <HeroSection />
      <FeaturesSection mousePosition={mousePosition} />
      <ScreenshotsSection />
      <CTASection />
      <Footer />
    </div>
  );
};
