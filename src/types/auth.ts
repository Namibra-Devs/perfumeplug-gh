import { Customer } from "./customer";

export interface RegisterCustomerRequest {
  firstName: string;          // 2–100 chars
  lastName: string;          // 2–100 chars
  email: string;         // valid + unique
  password: string;      // min 8, strong
  phone?: string;
  address?: string;
}

export type Password = string; // could be refined via Zod later

export interface RegisterCustomerResponse {
  success: boolean;
  message: string;
  error?: string;
  data: {
    customer: Customer;
    token: string;
  };
}

export interface LoginCustomerRequest {
  email: string;
  password: string;
}


export interface LoginCustomerResponse {
  success: boolean;
  message: string;
  data: {
    customer: Customer;
    token: string;
  };
}


// Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}


export type RegisterError =
  | { statusCode: 400; message: "Validation error" | "Email already exists"; errors?: Record<string, string[]> }
  | { statusCode: 500; message: "Internal Server Error" };

export type LoginError =
  | { statusCode: 400; message: "Missing email or password" }
  | { statusCode: 401; message: "Invalid credentials" }
  | { statusCode: 500; message: "Internal Server Error" };


  interface RegisterSuccessResponse {
  success: true;
  token: string;
  customer: Customer;
}

interface RegisterErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;
