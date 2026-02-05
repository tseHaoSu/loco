"use client";

import { useRef } from "react";

import { Code } from "lucide-react";
import { motion, useInView } from "framer-motion";

const embedCodeExample = `<script
  src="https://your-domain.com/widget.js"
  data-organization-id="your-org-id"
  data-position="bottom-right"
></script>`;

export const EmbedCodeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative z-40 px-4 sm:px-6 py-16 sm:py-24 md:py-32 max-w-7xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
        {/* Left: Code block */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-t-lg">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                index.html
              </span>
            </div>

            {/* Code content */}
            <div className="relative bg-card/50 backdrop-blur-sm border border-t-0 border-border rounded-b-lg overflow-hidden">
              <pre className="p-4 sm:p-6 overflow-x-auto text-sm sm:text-base">
                <code className="text-foreground font-mono whitespace-pre">
                  {embedCodeExample}
                </code>
              </pre>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            </div>

            {/* Decorative glow */}
            <motion.div
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          className="w-full lg:w-1/2 space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Simple Integration
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Integrate AI Assistant{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Instantly
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Add a single script tag to your website and start resolving customer
            issues with AI-powered support.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
