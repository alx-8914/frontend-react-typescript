import { createContext } from "react";
import type { ReactNode } from "react";
import { useState } from "react";
import api from "../services/api";
import { AxiosError } from "axios";

export interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login = async (email: string, password: string) => {
    try {
      console.log("Dados enviados:", { email, password }); // 👈
      const response = await api.post("/auth/login", { email, password });
      console.log("Resposta da API:", response.data); // 👈
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      const err = error as AxiosError;
      console.error("Erro no login:", err.response?.data);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};