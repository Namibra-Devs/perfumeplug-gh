export interface PaystackPaymentData {
  reference: string;
  amount: number;   // Paystack returns amount in major units for your API
  currency: string;
  status: string;
  paidAt: string;
}

//Initialize Payment (POST /orders/:orderId/initialize-payment)
export interface InitializePaymentRequest {
  email: string;
  callbackUrl: string;
}

export interface InitializePaymentResponse {
  success: boolean;
  message: string;
  data: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
}

//Verify Payment (GET /orders/:orderId/verify-payment)
export interface VerifyPaymentQuery {
  reference: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    order: {
      _id: string;
      orderNumber: string;
      paymentStatus: string;
      status: string;
    };
    payment: {
      reference: string;
      amount: number;
      currency: string;
      status: string;
      paidAt: string;
    };
  };
}


//Paystack Webhook (POST /webhook/paystack)
export interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    amount: number;     // Paystack sends amount in kobo (GHC1 = 100 kobo)
    currency: string;
    status: string;
    paid_at: string;
    customer: {
      email: string;
    };
  };
}


export interface PaystackWebhookResponse {
  success: boolean;
  message: string;
}


//Standard Error Response (All Endpoints)
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: ErrorCode;
    details?: Record<string, unknown>;
  };
}

//Validation Error Response (Field-Level)
export interface ValidationErrorResponse {
  success: false;
  error: {
    message: "Validation failed";
    code: "VALIDATION_ERROR";
    details: {
      errors: {
        field: string;
        message: string;
      }[];
    };
  };
}


//Error Code Enum (Strongly Typed)
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_PRODUCT"
  | "INSUFFICIENT_STOCK"
  | "INVALID_PRICE"
  | "UNAUTHORIZED"
  | "INVALID_CREDENTIALS"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "TENANT_NOT_FOUND"
  | "DUPLICATE_EMAIL"
  | "RATE_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR"
  | "PAYMENT_GATEWAY_ERROR";


//Rate Limit Error Response
export interface RateLimitErrorResponse {
  success: false;
  error: {
    message: string;
    code: "RATE_LIMIT_EXCEEDED";
    details: {
      retryAfter: number;   // seconds until retry
    };
  };
}


//Rate-Limit Headers Type (optional)
export interface RateLimitHeaders {
  "X-RateLimit-Limit": string;
  "X-RateLimit-Remaining": string;
  "X-RateLimit-Reset": string; // epoch timestamp
}


