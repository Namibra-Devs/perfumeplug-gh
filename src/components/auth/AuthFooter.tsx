// src/components/auth/AuthFooter.tsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

interface AuthFooterProps {
  isLogin: boolean;
  onToggleMode: () => void;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ isLogin, onToggleMode }) => (
  <>
    {/* Toggle Mode */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-6 text-center"
    >
      <button
        onClick={onToggleMode}
        className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200 hover:underline"
      >
        {isLogin 
          ? "Don't have an account? Create one now" 
          : "Already have an account? Sign in instead"
        }
      </button>
    </motion.div>

    {/* Additional Trust Elements */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-6 text-center text-xs text-gray-400"
    >
      <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
    </motion.div>

    {/* Back to Home Link */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-8 text-center"
    >
      <a
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 text-sm font-medium transition-colors duration-200 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <Home size={16} />
        <span>Back to Home</span>
      </a>
    </motion.div>
  </>
);

export default AuthFooter;