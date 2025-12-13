"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { Button } from "@workspace/ui/components/button";

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9] as const,
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const HeroSection = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring physics for parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={heroRef}
      className="relative z-40 px-4 sm:px-6 py-20 sm:py-32 md:py-40 max-w-7xl mx-auto"
      style={{ y, opacity }}
    >
      <motion.div
        className="text-center space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={textVariants} className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-foreground">
              AI-Powered Customer Service
            </span>
          </div>
        </motion.div>

        {/* Enhanced Headline with letter animation */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          variants={textVariants}
        >
          <motion.span
            className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] relative"
            animate={{
              backgroundPosition: ["0% center", "200% center"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Transform Your
            {/* Animated underline */}
            <motion.span
              className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ originX: 0 }}
            />
          </motion.span>
          <motion.span
            className="block text-foreground mt-2 relative"
            variants={textVariants}
          >
            Customer Service
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          variants={textVariants}
        >
          Deliver exceptional customer experiences with AI-powered
          conversations, intelligent routing, and real-time insights.
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          variants={textVariants}
        >
          <Link href="/sign-up">
            <Button size="lg" className="px-8 h-12">
              Try It Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="px-8 h-12">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
