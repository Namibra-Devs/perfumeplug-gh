// src/components/auth/TrustIndicators.tsx
import React from "react";
import { motion } from "framer-motion";
import { Shield, Heart } from "lucide-react";

const TrustIndicators: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="flex items-center justify-center gap-6 text-xs text-gray-400 mb-6"
  >
    <div className="flex flex-col md:flex-row items-center gap-1">
      <Shield size={14} className="text-green-400" />
      <span>Secure & Encrypted</span>
    </div>
    <div className="flex flex-col md:flex-row items-center gap-1">
      <Heart size={14} className="text-red-400" />
      <span>Trusted by 1000+ customers</span>
    </div>
  </motion.div>
);

export default TrustIndicators;