"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  MessageSquare,
  BarChart3,
  Shield,
  Sparkles,
  Quote,
  Star,
} from "lucide-react";
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

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Customer Success",
    company: "TechFlow Inc.",
    content:
      "Loco has transformed how we handle customer support. The AI-powered conversations are incredibly natural, and response times have improved by 80%. Our team can now focus on complex issues while the AI handles routine inquiries seamlessly.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "VP of Operations",
    company: "CloudScale",
    content:
      "The intelligent routing system is a game-changer. It automatically escalates issues to the right team members, reducing resolution time significantly. The real-time analytics give us insights we never had before.",
    avatar: "MR",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Customer Experience Director",
    company: "DataViz Solutions",
    content:
      "The knowledge base search feature is phenomenal. Our support agents can find answers instantly, and customers get accurate responses every time. The RAG system truly understands context and delivers personalized solutions.",
    avatar: "EW",
    rating: 5,
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

// Animated floating particles component
const FloatingParticles = ({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  if (!mounted) return null;

  return (
    <>
      {particles.map((particle) => {
        const windowWidth =
          typeof window !== "undefined" ? window.innerWidth : 1920;
        const windowHeight =
          typeof window !== "undefined" ? window.innerHeight : 1080;

        const distance = Math.sqrt(
          Math.pow(mousePosition.x - (particle.x * windowWidth) / 100, 2) +
            Math.pow(mousePosition.y - (particle.y * windowHeight) / 100, 2)
        );
        const maxDistance = Math.sqrt(windowWidth ** 2 + windowHeight ** 2);
        const influence = Math.max(0, 1 - distance / (maxDistance * 0.3));

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20 dark:bg-primary/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              x: influence * 20 * (Math.random() > 0.5 ? 1 : -1),
              y: influence * 20 * (Math.random() > 0.5 ? 1 : -1),
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        );
      })}
    </>
  );
};

// Animated geometric shapes
const GeometricShapes = () => {
  const shapes = [
    { size: 120, x: "10%", y: "20%", rotation: 45, duration: 15 },
    { size: 80, x: "85%", y: "15%", rotation: -30, duration: 18 },
    { size: 100, x: "15%", y: "80%", rotation: 60, duration: 20 },
    { size: 90, x: "90%", y: "75%", rotation: -45, duration: 16 },
  ];

  return (
    <>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute border border-primary/10 dark:border-primary/5"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            rotate: [shape.rotation, shape.rotation + 360],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
        </motion.div>
      ))}
    </>
  );
};

// Animated mesh gradient
const AnimatedMeshGradient = ({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) => {
  const meshRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!meshRef.current || !mounted) return;

    const updateMesh = () => {
      if (meshRef.current && typeof window !== "undefined") {
        const windowWidth = window.innerWidth || 1920;
        const windowHeight = window.innerHeight || 1080;
        const x = (mousePosition.x / windowWidth) * 100;
        const y = (mousePosition.y / windowHeight) * 100;
        meshRef.current.style.background = `
          radial-gradient(circle at ${x}% ${y}%, 
            oklch(0.7357 0.1641 34.7091 / 0.15) 0%, 
            oklch(0.8278 0.1131 57.9984 / 0.1) 30%, 
            transparent 70%
          )
        `;
      }
    };

    updateMesh();
  }, [mousePosition, mounted]);

  return (
    <motion.div
      ref={meshRef}
      className="absolute inset-0 opacity-40 dark:opacity-20"
      animate={{
        background: [
          "radial-gradient(circle at 20% 30%, oklch(0.7357 0.1641 34.7091 / 0.15) 0%, transparent 50%)",
          "radial-gradient(circle at 80% 70%, oklch(0.8278 0.1131 57.9984 / 0.15) 0%, transparent 50%)",
          "radial-gradient(circle at 20% 30%, oklch(0.7357 0.1641 34.7091 / 0.15) 0%, transparent 50%)",
        ],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Testimonial card component
const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

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
        delay: index * 0.15,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="relative p-8 bg-card/50 backdrop-blur-sm border-border overflow-hidden group h-full cursor-pointer transition-all duration-300">
        {/* Hover gradient effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, oklch(0.7357 0.1641 34.7091 / 0.08), transparent 70%)`,
          }}
        />

        {/* Quote icon */}
        <motion.div
          className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity"
          animate={
            isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Quote className="w-12 h-12 text-primary" />
        </motion.div>

        {/* Rating stars */}
        <div className="flex gap-1 mb-4 relative z-10">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{
                delay: index * 0.15 + i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              <Star className="w-4 h-4 fill-primary text-primary" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <p className="text-foreground mb-6 relative z-10 leading-relaxed">
          {testimonial.content}
        </p>

        {/* Author info */}
        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {testimonial.avatar}
          </motion.div>
          <div>
            <h4 className="font-semibold text-foreground">
              {testimonial.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {testimonial.role} at {testimonial.company}
            </p>
          </div>
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ width: "0%" }}
          animate={isHovered ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </Card>
    </motion.div>
  );
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
      {/* Enhanced Mouse-following gradient spotlight */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        animate={{
          background: [
            `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(0.7357 0.1641 34.7091 / 0.2), oklch(0.8278 0.1131 57.9984 / 0.1) 40%, transparent 70%)`,
            `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(0.8278 0.1131 57.9984 / 0.2), oklch(0.7357 0.1641 34.7091 / 0.1) 40%, transparent 70%)`,
            `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(0.7357 0.1641 34.7091 / 0.2), oklch(0.8278 0.1131 57.9984 / 0.1) 40%, transparent 70%)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-secondary dark:from-gray-900 dark:via-gray-950 dark:to-gray-950" />

        {/* Animated mesh gradient */}
        <AnimatedMeshGradient mousePosition={mousePosition} />

        {/* Enhanced animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/25 dark:bg-primary/15 rounded-full blur-3xl"
          animate={{
            y: [0, 50, -30, 0],
            x: [0, 40, -20, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.3, 0.5, 0.3, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-accent/25 dark:bg-accent/15 rounded-full blur-3xl"
          animate={{
            y: [0, -60, 40, 0],
            x: [0, -50, 30, 0],
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.3, 0.5, 0.3, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-primary/20 dark:bg-primary/12 rounded-full blur-3xl"
          animate={{
            y: [0, 40, -50, 0],
            x: [0, -40, 30, 0],
            scale: [1, 1.4, 0.9, 1],
            opacity: [0.25, 0.45, 0.25, 0.25],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          <FloatingParticles mousePosition={mousePosition} />
        </div>

        {/* Geometric shapes */}
        <GeometricShapes />

        {/* Animated grid overlay with parallax */}
        <motion.div
          className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.06]"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Animated scan lines effect */}
        <motion.div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              currentColor 2px,
              currentColor 4px
            )`,
          }}
          animate={{
            y: [0, 100],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
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
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
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
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              Customer Support
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
              <motion.div
                whileHover={{
                  scale: 1.08,
                  y: -2,
                  boxShadow: "0 20px 40px rgba(232, 149, 66, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-xl opacity-50"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <Button size="lg" className="px-8 h-12 group relative z-10">
                  Start Free Trial
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="ml-2 inline-block"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
            <Link href="#features">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-12 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Learn More</span>
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

      {/* Testimonials Section */}
      <section className="relative z-40 px-6 py-32 max-w-7xl mx-auto">
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
            Loved by teams worldwide
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            See what our customers are saying about their experience with Loco
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-40 px-6 py-32 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px 0px" }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <Card className="relative p-12 bg-card/50 backdrop-blur-sm border-border overflow-hidden group cursor-pointer">
            {/* Enhanced hover gradient effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                background: [
                  "radial-gradient(circle at 30% 50%, oklch(0.7357 0.1641 34.7091 / 0.1), transparent 70%)",
                  "radial-gradient(circle at 70% 50%, oklch(0.8278 0.1131 57.9984 / 0.1), transparent 70%)",
                  "radial-gradient(circle at 30% 50%, oklch(0.7357 0.1641 34.7091 / 0.1), transparent 70%)",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
              style={{
                background: `linear-gradient(90deg, 
                  transparent, 
                  oklch(0.7357 0.1641 34.7091 / 0.3), 
                  transparent
                )`,
                maskImage:
                  "linear-gradient(to right, transparent, black, transparent)",
              }}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <motion.div
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ x: 5 }}
              >
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                  whileHover={{ scale: 1.02 }}
                >
                  Ready to get started?
                </motion.h2>
                <motion.p
                  className="text-lg text-muted-foreground"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Join thousands of companies delivering exceptional customer
                  experiences with Loco.
                </motion.p>
              </motion.div>
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <Link href="/sign-up">
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      y: -3,
                      boxShadow: "0 20px 50px rgba(232, 149, 66, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-xl opacity-60"
                      animate={{
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <Button size="lg" className="px-8 h-12 group relative z-10">
                      Start Free Trial
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="ml-2 inline-block"
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
