import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LoaderCircle, 
  Mail, 
  Lock, 
  User, 
  MapPin,
  CheckCircle
} from "lucide-react";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { sanitizeGhanaPhoneNumber, isValidGhanaPhoneNumber } from "../../utils/phoneUtils";
import InputField from "./InputField";
import PhoneInputField from "./PhoneInputField";
import TrustIndicators from "./TrustIndicators";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";

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
          <AuthHeader isLogin={isLogin} />

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

          {/* Footer */}
          <AuthFooter isLogin={isLogin} onToggleMode={toggleMode} />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginRegisterSection;