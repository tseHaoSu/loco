"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Zap, MessageSquare, BarChart3, Shield, Sparkles } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  type Variants,
} from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Conversations",
    description: "Intelligent AI agents that understand context and deliver personalized responses to your customers.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Smart Routing",
    description: "Automatically escalate complex issues to the right team members with intelligent prioritization.",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track performance metrics and customer satisfaction with comprehensive dashboards and insights.",
    color: "chart-3",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and compliance with industry standards.",
    color: "chart-4",
  },
  {
    icon: MessageSquare,
    title: "Multi-Channel Support",
    description: "Seamlessly manage conversations across web, mobile, and embedded widgets.",
    color: "chart-5",
  },
  {
    icon: Zap,
    title: "Knowledge Base Search",
    description: "AI-powered RAG system that searches your documentation to provide accurate answers instantly.",
    color: "primary",
  },
];

// Color mapping for feature cards
const getColorClasses = (color: string): { bg: string; text: string } => {
  const defaultColor = { bg: "bg-primary/10", text: "text-primary" };
  const colorMap: Record<string, { bg: string; text: string }> = {
    primary: defaultColor,
    accent: { bg: "bg-accent/10", text: "text-accent" },
    "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
    "chart-4": { bg: "bg-chart-4/10", text: "text-chart-4" },
    "chart-5": { bg: "bg-chart-5/10", text: "text-chart-5" },
  };
  return colorMap[color] || defaultColor;
};

// Animated feature card component
const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  const Icon = feature.icon;
  const colors = getColorClasses(feature.color);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative p-6 space-y-4 bg-card/50 backdrop-blur-sm border-border overflow-hidden group">
        {/* Hover gradient effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, oklch(0.7357 0.1641 34.7091 / 0.05), transparent 70%)`,
          }}
        />

        <motion.div
          className={cn("w-12 h-12 rounded-lg flex items-center justify-center relative z-10", colors.bg)}
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icon className={cn("w-6 h-6", colors.text)} />
        </motion.div>

        <h3 className="text-xl font-semibold text-foreground relative z-10">
          {feature.title}
        </h3>
        <p className="text-muted-foreground relative z-10">
          {feature.description}
        </p>

        {/* Animated border */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
          initial={{ width: "0%" }}
          animate={isHovered ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
};

export const LandingView = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Text animation variants
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

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-following gradient spotlight - Full page */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(0.7357 0.1641 34.7091 / 0.15), oklch(0.8278 0.1131 57.9984 / 0.08) 40%, transparent 80%)`,
        }}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-secondary dark:from-gray-900 dark:via-gray-950 dark:to-gray-950" />

        {/* Animated gradient orbs with floating effect */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/15 dark:bg-primary/10 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Loco
          </span>
        </motion.div>

        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost">Sign In</Button>
            </motion.div>
          </Link>
          <Link href="/sign-up">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button>Get Started</Button>
            </motion.div>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative z-40 px-6 py-32 md:py-40 max-w-7xl mx-auto"
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
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-foreground">
                AI-Powered Customer Support
              </span>
            </motion.div>
          </motion.div>

          {/* Headline with letter animation */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            variants={textVariants}
          >
            <motion.span
              className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto]"
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
            </motion.span>
            <motion.span
              className="block text-foreground mt-2"
              variants={textVariants}
            >
              Customer Support
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            variants={textVariants}
          >
            Deliver exceptional customer experiences with AI-powered conversations,
            intelligent routing, and real-time insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={textVariants}
          >
            <Link href="/sign-up">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(232, 149, 66, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="px-8 h-12 group">
                  Start Free Trial
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
            <Link href="#features">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="px-8 h-12">
                  Learn More
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="pt-8 text-sm text-muted-foreground"
            variants={textVariants}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Trusted by innovative teams worldwide
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative z-40 px-6 py-32 max-w-7xl mx-auto">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Everything you need to succeed
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Powerful features to help you deliver world-class customer support
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-40 px-6 py-32 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative p-12 bg-card/50 backdrop-blur-sm border-border overflow-hidden group">
            {/* Hover gradient effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, oklch(0.7357 0.1641 34.7091 / 0.05), transparent 70%)`,
              }}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <motion.div
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to get started?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of companies delivering exceptional customer experiences with Loco.
                </p>
              </motion.div>
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/sign-up">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 40px rgba(232, 149, 66, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="px-8 h-12 group">
                      Start Free Trial
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-2"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="relative z-40 px-6 py-12 border-t border-border mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Loco. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};
