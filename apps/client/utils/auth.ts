
import { STORAGE_KEYS } from "@/constants/storage-keys.constant";
import { redirect } from "next/navigation";

export const logout = () => {
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    redirect('/login');
}