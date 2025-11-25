/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";


interface InputProps {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputProps> = ({ label, value, type = "text", onChange }) => (
  <div>
    <label className="block text-sm font-medium text-yellow-400 mb-1">
      {label}
    </label>
    <input
    title={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
    />
  </div>
);

const LoginRegisterSection: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await register({ ...formData });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
      <div className="max-w-md w-full p-6 relative z-50">
        <div className="bg-black/10 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-xl px-4 py-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center pb-4">
              <img src="/favicon.png" alt="PP" className="w-28" />
            </div>
            <h1 className="text-xl font-bold text-purple-600">
              {isLogin ? "Sign In to Your Account" : "Create New Account"}
            </h1>
            <p className="text-gray-300 mt-2 text-sm">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Join us to start shopping"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <InputField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(v) => setFormData({ ...formData, firstName: v })}
                />

                <InputField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(v) => setFormData({ ...formData, lastName: v })}
                />
              </>
            )}

            <InputField
              label="Email Address"
              value={formData.email}
              type="email"
              onChange={(v) => setFormData({ ...formData, email: v })}
            />

            <InputField
              label="Password"
              value={formData.password}
              type="password"
              onChange={(v) => setFormData({ ...formData, password: v })}
            />

            {!isLogin && (
              <>
                <InputField
                  label="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={(v) => setFormData({ ...formData, phone: v })}
                />

                <InputField
                  label="Address"
                  value={formData.address}
                  onChange={(v) => setFormData({ ...formData, address: v })}
                />
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-sm rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>

      <div className="inset-0 absolute flex items-center justify-center">
        <img src="/favicon.png" alt="PP" className="w-28" />
      </div>
    </div>
  );
};

export default LoginRegisterSection;
