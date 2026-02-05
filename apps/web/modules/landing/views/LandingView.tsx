"use client";

import { useState } from "react";
import {
  AnimatedBackground,
  Navigation,
  HeroSection,
  EmbedCodeSection,
  HowItWorksSection,
  FeaturesSection,
  ScreenshotsSection,
  TestimonialsSection,
  Footer,
} from "../components";

export const LandingView = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <>
      <div
        className="relative min-h-screen overflow-hidden bg-background"
        onMouseMove={handleMouseMove}
      >
        <AnimatedBackground mousePosition={mousePosition} />
        <Navigation />
        <HeroSection />
        <EmbedCodeSection />
        <HowItWorksSection />
        <FeaturesSection mousePosition={mousePosition} />
        <ScreenshotsSection />
        <TestimonialsSection />
        <Footer />
      </div>
      {/* <Script
        src="https://loco-web-gules.vercel.app/widget.js"
        data-organization-id="org_34xDMxfJTeH5sVbQ3EilTzttRPc"
        data-position="bottom-right"
        strategy="lazyOnload"
      /> */}
    </>
  );
};
