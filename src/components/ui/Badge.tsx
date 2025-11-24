// src/components/ui/Badge.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  delay = 0.1,
  className = '',
}) => {


  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm bg-yellow-700/10 rounded-xl border border-yellow-700 ${className}`}
    >

      <div className={`w-2 h-2 rounded-full animate-pulse bg-gradient-to-r from-yellow-500 to-yellow-700`} />
      <span className={`font-semibold uppercase tracking-wide bg-gradient-to-r from-yellow-500 to-orange-600 text-transparent bg-clip-text `}>
        {children}
      </span>
    </motion.div>
  );
};