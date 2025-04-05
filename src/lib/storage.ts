export const getStorageItem = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as T) : null;
};

export const setStorageItem = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorageItem = (key: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};
