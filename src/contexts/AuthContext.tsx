"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { getStorageItem } from "@/lib/storage";

type User = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext({} as AuthContextType);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storageUser = getStorageItem<User>("user");

    if (storageUser && Object.keys(storageUser).length > 0) {
      setUser(storageUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
