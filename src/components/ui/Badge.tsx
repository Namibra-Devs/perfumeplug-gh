// src/components/ui/Badge.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-4 py-2 rounded-xl font-semibold mb-4 shadow-lg ${className}`}
    >

      <Sparkles className="h-4 w-4" />
      <span className={`text-sm uppercase tracking-wide `}>
        {children}
      </span>
    </motion.div>
  );
};