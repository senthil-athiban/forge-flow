import { BACKEND_URL } from "@/app/config";
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const generateRefreshToken = async () => {
  try {
    const res = await axios.get<{ accessToken: string; refreshToken: string }>(
      `${BACKEND_URL}/api/v1/auth/refresh-token`
    );
    return res.data;
  } catch (error) {
    console.log("Error in fetching token");
  }
};
