"use client";

import { useState, useRef } from "react";
import { Quote, Star } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Card } from "@workspace/ui/components/card";

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

export const TestimonialsSection = () => {
  return (
    <section className="relative z-40 px-4 sm:px-6 py-16 sm:py-24 md:py-32 max-w-7xl mx-auto">
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
  );
};
