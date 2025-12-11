"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

export const CTASection = () => {
  return (
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
        <Card className="relative p-12 bg-card/50 backdrop-blur-sm border-border overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of companies delivering exceptional customer
                experiences with Loco.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/sign-up">
                <Button size="lg" className="px-8 h-12">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};
