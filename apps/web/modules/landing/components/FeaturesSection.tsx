"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, MessageSquare, BarChart3, Shield } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Conversations",
    description:
      "Intelligent AI agents that understand context and deliver personalized responses to your customers.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Smart Routing",
    description:
      "Automatically escalate complex issues to the right team members with intelligent prioritization.",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track performance metrics and customer satisfaction with comprehensive dashboards and insights.",
    color: "chart-3",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade security with end-to-end encryption and compliance with industry standards.",
    color: "chart-4",
  },
  {
    icon: MessageSquare,
    title: "Multi-Channel Support",
    description:
      "Seamlessly manage conversations across web, mobile, and embedded widgets.",
    color: "chart-5",
  },
  {
    icon: Zap,
    title: "Knowledge Base Search",
    description:
      "AI-powered RAG system that searches your documentation to provide accurate answers instantly.",
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
const FeatureCard = ({
  feature,
  index,
  mousePosition,
}: {
  feature: (typeof features)[0];
  index: number;
  mousePosition: { x: number; y: number };
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const [gradientPosition, setGradientPosition] = useState({
    x: "50%",
    y: "50%",
  });

  const Icon = feature.icon;
  const colors = getColorClasses(feature.color);

  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((mousePosition.x - rect.left) / rect.width) * 100;
      const y = ((mousePosition.y - rect.top) / rect.height) * 100;
      setGradientPosition({ x: `${x}%`, y: `${y}%` });
    }
  }, [mousePosition, isHovered]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.95 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card
        ref={cardRef}
        className="relative p-6 space-y-4 bg-card/50 backdrop-blur-sm border-border overflow-hidden group h-full cursor-pointer transition-all duration-300"
      >
        {/* Dynamic hover gradient effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${gradientPosition.x} ${gradientPosition.y}, oklch(0.7357 0.1641 34.7091 / 0.15), transparent 70%)`,
          }}
        />

        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(0.7357 0.1641 34.7091 / 0.1), transparent 70%)",
          }}
        />

        {/* Icon container with enhanced animation */}
        <motion.div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center relative z-10",
            colors.bg
          )}
          animate={
            isHovered
              ? {
                  scale: 1.15,
                  rotate: [0, -5, 5, -5, 0],
                  y: -5,
                }
              : {
                  scale: 1,
                  rotate: 0,
                  y: 0,
                }
          }
          transition={{
            scale: {
              type: "spring",
              stiffness: 400,
              damping: 15,
            },
            rotate: {
              duration: 0.5,
              ease: "easeInOut",
            },
            y: {
              type: "spring",
              stiffness: 400,
              damping: 15,
            },
          }}
        >
          <Icon className={cn("w-6 h-6", colors.text)} />
        </motion.div>

        <h3 className="text-xl font-semibold text-foreground relative z-10">
          {feature.title}
        </h3>
        <p className="text-muted-foreground relative z-10">
          {feature.description}
        </p>

        {/* Animated border with gradient */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ width: "0%" }}
          animate={isHovered ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100"
          initial={{ scale: 0, rotate: -45 }}
          animate={
            isHovered ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }
          }
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
        </motion.div>
      </Card>
    </motion.div>
  );
};

interface FeaturesSectionProps {
  mousePosition: { x: number; y: number };
}

export const FeaturesSection = ({ mousePosition }: FeaturesSectionProps) => {
  return (
    <section
      id="features"
      className="relative z-40 px-6 py-32 max-w-7xl mx-auto"
    >
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
          <FeatureCard
            key={index}
            feature={feature}
            index={index}
            mousePosition={mousePosition}
          />
        ))}
      </div>
    </section>
  );
};
