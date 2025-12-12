"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      className="relative z-50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto"
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

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-4">
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

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border sm:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col p-4 gap-3">
              <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
