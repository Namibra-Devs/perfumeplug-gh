/* eslint-disable react-refresh/only-export-components */
// contexts/AuthContext.tsx
import { useToast } from '../hooks/useToast';
import { RegisterCustomerRequest } from '../types/auth';
import { Customer } from '../types/customer';
import { createContext, useState, useEffect, ReactNode } from 'react';


interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterCustomerRequest) => Promise<void>;
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
      fetchProfile(savedToken);
    }else{
      console.log("No Token Found!");
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    try {
      const response = await fetch(
        'https://pos-api-pm1f.onrender.com/customers/profile',
        {
          headers: {
            'X-Tenant-Domain': import.meta.env.NEXT_PUBLIC_TENANT_DOMAIN!,
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCustomer(data.data.customer);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const login = async (email: string, password: string) => {

    setIsLoading(true);

    try {
      const response = await fetch(
        'https://pos-api-pm1f.onrender.com/customers/login',
        {
          method: 'POST',
          headers: {
            'X-Tenant-Domain': 'https://perfumeplug-gh.onrender.com/',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
      }

      const data = await response.json();
      console.log("Login Info:", data);
      setToken(data.data.token);
      setCustomer(data.data.customer);
      toast.success("Login Successfull!"); 
      // Store token
      localStorage.setItem('customerToken', data.data.token);

      return data.data.customer;

    }catch(error){
      console.log(error);
      toast.error("Something went wrong, please try again!");
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
    
  };

  const register = async (customerData: RegisterCustomerRequest) => {
    setIsLoading(true);
    try{
      const response = await fetch(
        'https://pos-api-pm1f.onrender.com/customers/register',
        {
          method: 'POST',
          headers: {
            'X-Tenant-Domain': 'https://perfumeplug-gh.onrender.com/',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customerData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
      }

      const data = await response.json();

      setToken(data.data.token);
      setCustomer(data.data.customer);
      console.log("Register Info:", data);
      toast.success("Registration Successfull!");

      //Store Token
      localStorage.setItem('customerToken', data.data.token);

      return data.data.customer;

    }catch(error){
      console.log(error);
      toast.error("Registration failed, please try again!");
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }

  
    // Usage
    // try {
    //   const customer = await registerCustomer({
    //     name: 'John Doe',
    //     email: 'john@example.com',
    //     password: 'SecurePass123!',
    //     phone: '+1234567890'
    //   });
    //   console.log('Registration successful:', customer);
    // } catch (error) {
    //   console.error('Registration failed:', error.message);
    // }
  };

  const logout = () => {
    setIsLoading(true);
    try{
      setToken(null);
      setCustomer(null);
      localStorage.removeItem('customerToken');
      toast.success("Logout Successfull!");
    }catch(error){
      console.log(error);
      toast.error("Fail to logout, try again!");
    }finally{
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


// import React, { createContext, useState, ReactNode } from 'react';
// import { User } from '../types';

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     // Mock login - in real app, this would be an API call
//     if (email === 'demo@perfumeplug.com' && password === 'password') {
//       const mockUser: User = {
//         id: '1',
//         email: 'demo@perfumeplug.com',
//         firstName: 'John',
//         lastName: 'Doe',
//         phone: '+233 12 345 6789'
//       };
//       setUser(mockUser);
//       return true;
//     }
//     return false;
//   };

//   const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
//     // Mock registration - in real app, this would be an API call
//     const newUser: User = {
//       id: Date.now().toString(),
//       email: userData.email,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       phone: userData.phone
//     };
//     setUser(newUser);
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   const isAuthenticated = !!user;

//   return (
//     <AuthContext.Provider value={{
//       user,
//       login,
//       register,
//       logout,
//       isAuthenticated
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };