import axios from "@/lib/axios";

export const useRefreshToken = () => {
    const generateRefreshToken = async () => {
        const res = await axios.get<{accessToken: string, refreshToken: string}>("http://localhost:8000/api/v1/auth/refresh-token");
        return res.data;
    }
    return generateRefreshToken;
}