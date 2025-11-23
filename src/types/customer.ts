export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;            // you can create a Phone type if needed
  address: string;
  isRegistered: boolean;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;        // or Date if you parse it
  updatedAt: string;        // or Date if you parse it
}

export interface CustomerResponse {
  success: boolean;
  data: {
    customer: Customer;
  };
}

export type Phone = `+${number}`;

export interface UpdateCustomerProfileRequest {
  name?: string;      // optional because user may update only one field
  phone?: string;
  address?: string;
}

export interface UpdateCustomerProfileResponse {
  success: boolean;
  message: string;
  data: {
    customer: {
      _id: string;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      isRegistered: boolean;
      loyaltyPoints: number;
      updatedAt: string; // ISO timestamp
    };
  };
}


export interface UpdateCustomerProfileError {
  success: false;
  statusCode: 400 | 401 | 500;
  message: string;
  errors?: Record<string, string[]>;
}
