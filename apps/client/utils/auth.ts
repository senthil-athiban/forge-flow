import { STORAGE_KEYS } from "@/constants/storage-keys.constant";
import UserService from "@/services/user.service";

export const logout = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.location.replace("/login");
  }
};

export const getUser = async () => {
  try {
    const res = await UserService.getProfile();
    return res.user;
  } catch (error) {
    // console.warn("Error in fetching user : ", error);
  }
};
