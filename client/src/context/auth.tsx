import apiClient from "@/lib/apiClient";
import { ReactNode, createContext, useContext, useEffect } from "react";

interface AuthContextType {
  login: (token: string) => void;
  logout: () => void;
}

interface AuthContextProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
})

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: AuthContextProps) => {

  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("auth_token", token);
  }

  const logout = () => {
    localStorage.removeItem("auth_token");
  }

  const value = {
    login,
    logout,
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}