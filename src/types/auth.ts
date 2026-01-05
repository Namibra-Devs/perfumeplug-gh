// ACTIVELY USED TYPE
export interface RegisterCustomerRequest {
  firstName: string;          // 2–100 chars
  lastName: string;          // 2–100 chars
  email: string;         // valid + unique
  password: string;      // min 8, strong
  phone?: string;
  address?: string;
}