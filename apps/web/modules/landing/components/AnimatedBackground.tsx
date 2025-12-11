"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface MousePosition {
  x: number;
  y: number;
}

// Animated floating particles component
const FloatingParticles = ({
  mousePosition,
}: {
  mousePosition: MousePosition;
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
  mousePosition: MousePosition;
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

interface AnimatedBackgroundProps {
  mousePosition: MousePosition;
}

export const AnimatedBackground = ({
  mousePosition,
}: AnimatedBackgroundProps) => {
  return (
    <>
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
    </>
  );
};
