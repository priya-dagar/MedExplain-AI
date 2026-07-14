export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone_number?: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}