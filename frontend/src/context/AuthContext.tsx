import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, LoginPayload, SignupPayload } from "../types/user";
import * as authService from "../services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  signup: (data: SignupPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, check if a token exists and try to restore the session
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (data: LoginPayload) => {
    const res = await authService.login(data);
    localStorage.setItem("access_token", res.access_token);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const signup = async (data: SignupPayload) => {
    await authService.signup(data);
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}