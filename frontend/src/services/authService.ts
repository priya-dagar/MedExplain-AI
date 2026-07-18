import api from "./api";
import { LoginPayload, SignupPayload, AuthResponse, User } from "../types/user";

export const signup = async (data: SignupPayload): Promise<User> => {
  const response = await api.post<User>("/api/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/api/auth/me");
  return response.data;
};

export const verifyOtp = async (email: string, otp: string): Promise<{ message: string }> => {
  const response = await api.post("/api/auth/verify-otp", null, { params: { email, otp } });
  return response.data;
};

export const resendOtp = async (email: string): Promise<{ message: string }> => {
  const response = await api.post("/api/auth/resend-otp", null, { params: { email } });
  return response.data;
};