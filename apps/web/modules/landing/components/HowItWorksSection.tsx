"use client";

import { useRef } from "react";
import { Bot, Upload, Users, CheckCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Knowledge",
    description:
      "Drag and drop any documents into your Knowledge Base. Our AI reads and understands your data using advanced RAG technology.",
  },
  {
    icon: Bot,
    title: "Embed the Widget",
    description:
      "Add a single script to your website. The AI-powered widget instantly starts resolving customer issues based on your data.",
  },
  {
    icon: Users,
    title: "Monitor Conversations",
    description:
      "Oversee multiple conversations at once from your dashboard. The AI handles routine queries while you focus on what matters.",
  },
  {
    icon: CheckCircle,
    title: "Seamless Escalation",
    description:
      "When needed, the AI escalates to human agents. Otherwise, it resolves issues autonomously, 24/7.",
  },
];

const StepCard = ({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
        </motion.div>

        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
        <p className="text-muted-foreground max-w-xs">{step.description}</p>
      </div>

      {index < steps.length - 1 && (
        <motion.div
          className="hidden lg:block absolute top-8 left-[60%] w-[calc(100%-20%)] h-0.5"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
          style={{ originX: 0 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-primary/50 to-primary/10" />
        </motion.div>
      )}
    </motion.div>
  );
};

export const HowItWorksSection = () => {
  return (
    <section className="relative z-40 px-4 sm:px-6 py-16 sm:py-24 md:py-32 max-w-7xl mx-auto">
      <motion.div
        className="text-center space-y-4 mb-20"
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
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Automate support in minutes
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          An embeddable AI widget that resolves customer issues using your data.
          Let AI handle the volume while you focus on complex cases.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} index={index} />
        ))}
      </div>

      <motion.div
        className="mt-20 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">24/7</div>
            <div className="text-muted-foreground">Autonomous Resolution</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">90%</div>
            <div className="text-muted-foreground">Issues Resolved by AI</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">&lt;1min</div>
            <div className="text-muted-foreground">Average Response Time</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
