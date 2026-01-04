// src/components/auth/InputField.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  success?: boolean;
  hint?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  type = "text", 
  onChange, 
  error, 
  icon,
  placeholder,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  success,
  hint
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>

      <div className="relative">
        <input
          title={label}
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-black/20 backdrop-blur-sm text-white text-sm placeholder:text-gray-400 border-2 rounded-xl outline-none transition-all duration-300 ${
            error 
              ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
              : success
              ? "border-green-500/60 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              : isFocused
              ? "border-yellow-500/80 focus:ring-2 focus:ring-yellow-500/20"
              : "border-yellow-600/30 hover:border-yellow-500/50"
          }`}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {success && !error && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
            <CheckCircle size={18} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-red-400 text-xs mt-2"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
        {hint && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 text-xs mt-2 flex items-center gap-1"
          >
            <CheckCircle size={12} />
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InputField;