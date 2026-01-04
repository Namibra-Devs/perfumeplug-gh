import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LoaderCircle, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Shield,
  Heart,
  ArrowLeft,
  Home
} from "lucide-react";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { sanitizeGhanaPhoneNumber, isValidGhanaPhoneNumber } from "../../utils/phoneUtils";

// Zod validation schemas
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
});

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  phone: z
    .string()
    .optional()
    .refine((phone) => !phone || isValidGhanaPhoneNumber(phone), {
      message: "Please enter a valid Ghana phone number (e.g., 0240000000)"
    }),
  address: z
    .string()
    .min(10, "Please provide a detailed address for delivery purposes")
    .max(200, "Address must be less than 200 characters")
});

/* -------------------------
   Enhanced Input Component
-------------------------- */
interface InputProps {
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

const InputField: React.FC<InputProps> = ({ 
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

        {success && !error && (
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

/* -------------------------
   Enhanced Phone Input Component
-------------------------- */
interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PhoneInputField: React.FC<PhoneInputProps> = ({ label, value, onChange, error }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isValid, setIsValid] = useState(false);
  
  const handleChange = (inputValue: string) => {
    setDisplayValue(inputValue);
    onChange(inputValue);
    setIsValid(inputValue.trim() ? isValidGhanaPhoneNumber(inputValue) : false);
  };

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <InputField
      label={label}
      value={displayValue}
      type="tel"
      onChange={handleChange}
      error={error}
      icon={<Phone size={16} />}
      placeholder="e.g., 0240000000 or +233200000000"
      success={isValid}
      hint={value.trim() && isValid ? `Will be saved as: ${sanitizeGhanaPhoneNumber(value)}` : undefined}
    />
  );
};

/* -------------------------
   Trust Indicators Component
-------------------------- */
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

/* -------------------------
      Main Component
-------------------------- */
const LoginRegisterSection: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isLoading } = useAuth();
  const toast = useToast();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // Real-time validation
  useEffect(() => {
    const schema = isLogin ? loginSchema : registerSchema;
    const result = schema.safeParse(formData);
    setIsFormValid(result.success);
    
    // Clear errors for valid fields
    if (result.success) {
      setErrors({});
    }
  }, [formData, isLogin]);

  /* -------------------------
        Validation Logic
  -------------------------- */
  const validate = () => {
    const schema = isLogin ? loginSchema : registerSchema;
    const result = schema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  /* -------------------------
         Form Submit
  -------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors above before submitting.");
      return;
    }

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result) {
          toast.success(`Welcome back, ${result.firstName || result.email}!`);
          console.log("Login successful for:", result.email);
        }
      } else {
        const sanitizedData = {
          ...formData,
          phone: formData.phone.trim() ? sanitizeGhanaPhoneNumber(formData.phone) : ""
        };
        
        const result = await register(sanitizedData);
        if (result) {
          toast.success(`Welcome to PerfumePlug, ${result.firstName}!`);
          console.log("Registration successful for:", result.email);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    });
  };

  /* -------------------------
    UI
  -------------------------- */
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center p-4">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-black/20 backdrop-blur-xl border border-yellow-500/20 rounded-3xl shadow-2xl p-4 md:p-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="w-28 h-16 p-2 mx-auto mb-4 bg-black/30 backdrop-blur-xl border border-yellow-500/20 rounded-2xl flex items-center justify-center shadow-lg">
              <img src="/favicon.png" className="w-full h-11" alt="PerfumePlug Logo" />
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

          {/* Trust Indicators */}
          <TrustIndicators />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      value={formData.firstName}
                      onChange={(v) => setFormData({ ...formData, firstName: v })}
                      error={errors.firstName}
                      icon={<User size={16} />}
                      placeholder="John"
                      success={formData.firstName.length >= 2 && !errors.firstName}
                    />

                    <InputField
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(v) => setFormData({ ...formData, lastName: v })}
                      error={errors.lastName}
                      icon={<User size={16} />}
                      placeholder="Doe"
                      success={formData.lastName.length >= 2 && !errors.lastName}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <InputField
              label="Email Address"
              value={formData.email}
              type="email"
              onChange={(v) => setFormData({ ...formData, email: v })}
              error={errors.email}
              icon={<Mail size={16} />}
              placeholder="your@email.com"
              success={formData.email.includes('@') && !errors.email}
            />

            <InputField
              label="Password"
              value={formData.password}
              onChange={(v) => setFormData({ ...formData, password: v })}
              error={errors.password}
              icon={<Lock size={16} />}
              placeholder={isLogin ? "Enter your password" : "Create a strong password"}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
              success={formData.password.length >= (isLogin ? 6 : 8) && !errors.password}
            />

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <PhoneInputField
                    label="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={(v) => setFormData({ ...formData, phone: v })}
                    error={errors.phone}
                  />

                  <InputField
                    label="Delivery Address"
                    value={formData.address}
                    onChange={(v) => setFormData({ ...formData, address: v })}
                    error={errors.address}
                    icon={<MapPin size={16} />}
                    placeholder="Your full address for delivery"
                    success={formData.address.length >= 10 && !errors.address}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading || !isFormValid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 text-sm rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                isLoading || !isFormValid
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  {isFormValid && <CheckCircle size={18} />}
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle Mode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <button
              onClick={toggleMode}
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
        </div>
      </motion.div>
    </div>
  );
};

export default LoginRegisterSection;