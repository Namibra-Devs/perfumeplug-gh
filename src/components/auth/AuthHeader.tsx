// src/components/auth/AuthHeader.tsx
import React from "react";
import { motion } from "framer-motion";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isLogin }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="text-center mb-8"
  >
    <div className="w-28 h-16 mx-auto mb-4 p-2 bg-black/20 backdrop-blur-xl border border-yellow-500/20 rounded-2xl flex items-center justify-center shadow-lg">
      <img src="/favicon.png" className="w-full h-11" alt="PerfumePlug" />
    </div>
    
    <h1 className="text-2xl font-bold text-white mb-2">
      {isLogin ? "Welcome Back!" : "Join PerfumePlug"}
    </h1>
    <p className="text-gray-300 text-sm">
      {isLogin 
        ? "Sign in to continue your fragrance journey" 
        : "Create your account and discover amazing scents"
      }
    </p>
  </motion.div>
);

export default AuthHeader;