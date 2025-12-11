"use client";

import { motion } from "framer-motion";

export const Footer = () => {
  return (
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
  );
};
