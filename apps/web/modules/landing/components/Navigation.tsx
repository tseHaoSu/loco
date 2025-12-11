"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";

export const Navigation = () => {
  return (
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
  );
};
