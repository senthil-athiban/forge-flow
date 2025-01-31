
import { STORAGE_KEYS } from "@/constants/storage-keys.constant";

export const logout = () => {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        window.location.replace('/login');
    }
}