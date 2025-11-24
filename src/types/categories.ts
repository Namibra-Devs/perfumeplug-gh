export interface Category {
  name: string;
  productCount: number;
}


export interface GetCategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

export interface TenantHeader {
  "X-Tenant-Domain": string;
}
