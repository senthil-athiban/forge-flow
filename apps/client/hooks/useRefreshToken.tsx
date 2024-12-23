import { BACKEND_URL } from "@/app/config";
import axios from "@/lib/axios";

export const useRefreshToken = () => {
    const generateRefreshToken = async () => {
        try {
            const res = await axios.get<{accessToken: string, refreshToken: string}>(`${BACKEND_URL}/api/v1/auth/refresh-token`);
            return res.data;
        } catch (error) {
            console.log('Error in fetching token');
        }
    }
    return generateRefreshToken;
}