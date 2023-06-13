import apiClient from "@/lib/apiClient";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: null | {
    id: number;
    email: string;
    userName: string;
  };
  login: (token: string) => void;
  logout: () => void;
}

interface AuthContextProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [user, setUser] = useState<null | {
    id: number;
    email: string;
    userName: string;
  }>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
      apiClient
        .get("/users/find")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("auth_token", token);
    try {
      apiClient.get("/users/find").then((res) => {
        setUser(res.data.user);
      });
    } catch (error) {
      console.log(error);
    }
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
  };

  const value = {
    user,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
