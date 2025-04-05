import { User } from "@/types/User";

const USER_KEY = "finance-app-user";
const SESSION_KEY = "finance-app-session";

export const saveUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const saveSession = () => {
  const expiration = new Date().getTime() + 30 * 60 * 1000;
  localStorage.setItem(SESSION_KEY, expiration.toString());
};

export const isSessionActive = (): boolean => {
  const expiration = localStorage.getItem(SESSION_KEY);
  if (!expiration) return false;
  return new Date().getTime() < Number(expiration);
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
