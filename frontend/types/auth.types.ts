// Wire-format types — field names match the backend Pydantic schemas
// (backend/schemas/auth.py, backend/schemas/user_schemas.py) exactly, so
// there's no case-mapping layer between the API and the client.

export type UserRole = "user" | "recruiter" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Shape every successful response is wrapped in by the backend's
// ResponseMiddleware (backend/api/middleware/response_handler.py).
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// AppError shape (backend/api/middleware/error_handler.py).
export interface ApiAppError {
  error: {
    code: string;
    message: string;
  };
}

// Raw FastAPI/Pydantic validation-error shape (bypasses AppError, e.g. 422).
export interface ApiValidationError {
  detail: string | { msg: string; loc?: (string | number)[]; type?: string }[];
}
