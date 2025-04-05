import { createContext, useState, ReactNode } from "react";
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
  const storageUser = getStorageItem<User>("user");

  const [user, setUser] = useState<User | null>(
    storageUser && Object.keys(storageUser).length > 0 ? storageUser : null
  );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
