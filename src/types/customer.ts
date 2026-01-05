// ACTIVELY USED TYPE
export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
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