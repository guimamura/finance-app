import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "@/lib/storage";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStorageItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (email: string, password: string) => {
    const storedUser = getStorageItem("user");
    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      setUser(storedUser);
      setStorageItem("session-expire", Date.now() + 1000 * 60 * 5); // 5 minutos
      router.push("/dashboard");
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string) => {
    const newUser = { name, email, password };
    setStorageItem("user", newUser);
    setUser(newUser);
    setStorageItem("session-expire", Date.now() + 1000 * 60 * 5); // 5 minutos
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    removeStorageItem("session-expire");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
