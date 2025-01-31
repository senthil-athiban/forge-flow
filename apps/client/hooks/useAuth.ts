"use client";

import { STORAGE_KEYS } from "@/constants/storage-keys.constant";
import UserService from "@/services/user.service";
import { getFromLocalStorage } from "@/utils/storage";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState({});
  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      if(getFromLocalStorage(STORAGE_KEYS.ACCESS_TOKEN) !== "undefined") {
        return Boolean(getFromLocalStorage(STORAGE_KEYS.ACCESS_TOKEN));
      }
    }
    return false;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await UserService.verifyUser();
      setUser(res.user);
    }
    fetchUser();
  },[]);

  return {
    isAuthenticated: isAuthenticated(),
    user
  };
};

export default useAuth;
