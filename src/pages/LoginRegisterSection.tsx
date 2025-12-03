
import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { sanitizeGhanaPhoneNumber, isValidGhanaPhoneNumber, formatGhanaPhoneNumber } from "../utils/phoneUtils";

/* -------------------------
   Reusable Input Component
-------------------------- */
interface InputProps {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
  error?: string;
}
const InputField: React.FC<InputProps> = ({ label, value, type = "text", onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-yellow-400 mb-1">{label}</label>

    <input
      title={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border ${
        error ? "border-red-500" : "border-yellow-600/20"
      } rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
    />

    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

/* -------------------------
   Phone Input Component
-------------------------- */
interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}
const PhoneInputField: React.FC<PhoneInputProps> = ({ label, value, onChange, error }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  const handleChange = (inputValue: string) => {
    setDisplayValue(inputValue);
    onChange(inputValue);
  };

  const handleBlur = () => {
    // On blur, show the formatted version if it's a valid number
    if (value.trim() && isValidGhanaPhoneNumber(value)) {
      const formatted = formatGhanaPhoneNumber(value);
      setDisplayValue(formatted);
    }
  };

  const handleFocus = () => {
    // On focus, show the raw input for easier editing
    setDisplayValue(value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-yellow-400 mb-1">{label}</label>
      
      <input
        title={label}
        type="tel"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="e.g., 0242826513 or +233242826513"
        className={`w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border ${
          error ? "border-red-500" : "border-yellow-600/20"
        } rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
      />
      
      {value.trim() && isValidGhanaPhoneNumber(value) && (
        <p className="text-green-400 text-xs mt-1">
          ✓ Will be saved as: {sanitizeGhanaPhoneNumber(value)}
        </p>
      )}
      
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

/* -------------------------
      Main Component
-------------------------- */
const LoginRegisterSection: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading } = useAuth();
  const toast = useToast();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  /* -------------------------
        Validation Logic
  -------------------------- */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!isLogin) {
      // Register-specific validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = "First name must be at least 2 characters";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = "Last name must be at least 2 characters";
      }

      // Ghana phone number (optional, but if provided, must be valid)
      if (formData.phone.trim()) {
        if (!isValidGhanaPhoneNumber(formData.phone)) {
          newErrors.phone = "Please enter a valid Ghana phone number (e.g., 0242826513)";
        }
      }

      // Address required for future checkout
      if (!formData.address.trim()) {
        newErrors.address = "Address is required for delivery purposes";
      } else if (formData.address.trim().length < 10) {
        newErrors.address = "Please provide a more detailed address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          // Login successful - user will be redirected by the auth system
          console.log("Login successful for:", result.email);
        }
      } else {
        // Sanitize phone number before registration
        const sanitizedData = {
          ...formData,
          phone: formData.phone.trim() ? sanitizeGhanaPhoneNumber(formData.phone) : ""
        };
        
        const result = await register(sanitizedData);
        if (result) {
          // Registration successful - user will be redirected by the auth system
          console.log("Registration successful for:", result.email);
        }
      }
    } catch (error) {
      // Error handling is now done in the AuthContext
      console.error("Form submission error:", error);
    }
  };

  /* -------------------------
    UI
  -------------------------- */
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
      <div className="max-w-md w-full px-6 pt-6 pb-20 relative z-50">
        <div className="bg-black/10 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-xl px-4 py-6">

          <div className="text-center mb-6">
            <img src="/favicon.png" className="w-24 mx-auto" alt="Logo" />
            <h1 className="text-xl font-bold text-purple-500">
              {isLogin ? "Sign In to Your Account" : "Create New Account"}
            </h1>
            <p className="text-gray-300 mt-2 text-sm">
              {isLogin ? "Enter your credentials" : "Join us to start shopping"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <InputField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(v) => setFormData({ ...formData, firstName: v })}
                  error={errors.firstName}
                />

                <InputField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(v) => setFormData({ ...formData, lastName: v })}
                  error={errors.lastName}
                />
              </>
            )}

            <InputField
              label="Email Address"
              value={formData.email}
              type="email"
              onChange={(v) => setFormData({ ...formData, email: v })}
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(v) => setFormData({ ...formData, password: v })}
              error={errors.password}
            />

            {!isLogin && (
              <>
                <PhoneInputField
                  label="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={(v) => setFormData({ ...formData, phone: v })}
                  error={errors.phone}
                />

                <InputField
                  label="Address"
                  value={formData.address}
                  onChange={(v) => setFormData({ ...formData, address: v })}
                  error={errors.address}
                />
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-sm rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? <LoaderCircle size={18} className="animate-spin" /> : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-blue-400 hover:text-blue-500 font-medium text-sm"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginRegisterSection;