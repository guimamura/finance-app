import { removeStorageItem } from "./storage";

export const logout = () => {
  removeStorageItem("user");
};
