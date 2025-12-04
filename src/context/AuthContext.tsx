/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// contexts/AuthContext.tsx
import { useToast } from '../hooks/useToast';
import { RegisterCustomerRequest } from '../types/auth';
import { Customer } from '../types/customer';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../lib/api';


interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  login: (email: string, password: string) => Promise<Customer | undefined>;
  register: (data: RegisterCustomerRequest) => Promise<Customer | undefined | null>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Load token from localStorage on mount
    const savedToken = localStorage.getItem('customerToken');
    if (savedToken) {
      setToken(savedToken);
      // Optionally fetch customer profile
      fetchProfile();
    }else{
      console.log("No Token Found!");
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiFetch<{ customer: Customer }>('/api/ecommerce/customers/profile', {}, true);
      setCustomer(data.customer);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const data = await apiFetch<{ token: string; customer: Customer }>(
        '/api/ecommerce/customers/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password })
        }
      );

      console.log("Login Response:", data);

      if (data && data.token && data.customer) {
        setToken(data.token);
        setCustomer(data.customer);
        localStorage.setItem('customerToken', data.token);
        
        toast.success("Login successful!");
        return data.customer;
      }
      
      console.error("Unexpected response structure:", data);
      toast.error("Login failed - unexpected response format");
      return undefined;

    } catch (error: unknown) {
      console.error("Login error:", error);
      
      let errorMessage = "Something went wrong, please try again!";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (customerData: RegisterCustomerRequest) => {
    setIsLoading(true);
    console.log("Sending Customer Data:", customerData);
    
    try {
      const data = await apiFetch<{ token: string; customer: Customer }>(
        '/api/ecommerce/customers/register',
        {
          method: 'POST',
          body: JSON.stringify(customerData)
        }
      );

      console.log("Registration Response:", data);

      if (data && data.token && data.customer) {
        setToken(data.token);
        setCustomer(data.customer);
        localStorage.setItem('customerToken', data.token);
        
        toast.success("Registration successful!");
        return data.customer;
      }
      
      console.error("Unexpected response structure:", data);
      toast.error("Registration failed - unexpected response format");
      return null;

    } catch (error: unknown) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed, please try again!";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    try {
      setToken(null);
      setCustomer(null);
      localStorage.removeItem('customerToken');
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout, please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}