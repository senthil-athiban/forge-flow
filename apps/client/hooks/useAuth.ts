"use client";

import { STORAGE_KEYS } from "@/constants/storage-keys.constant";
import { getFromLocalStorage } from "@/utils/storage";

const useAuth = () => {
  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      return Boolean(getFromLocalStorage(STORAGE_KEYS.ACCESS_TOKEN));
    }
    return false;
  };

  return {
    isAuthenticated: isAuthenticated(),
  };
};

export default useAuth;
