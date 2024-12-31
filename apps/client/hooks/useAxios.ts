"use client";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken"
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";

const useAxios = () => {
    const generateRefreshToken = useRefreshToken();
    const router = useRouter();
    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                if(!config.headers["Authorization"]) {
                    config.headers["Authorization"] = localStorage.getItem('accessToken');
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if(error.response?.status === 401 && !prevRequest.sent) {
                    prevRequest.sent = true;
                    try {
                        const response = await generateRefreshToken();
                        //@ts-ignore
                        const newAccessToken = response?.data?.accesstoken;
                        localStorage.setItem("accessToken", newAccessToken);
                        prevRequest.headers["Authorization"] = `${newAccessToken}`;
                        return axiosInstance(prevRequest);
                    } catch (error) {
                        // Refresh token expired or invalid
                        //@ts-ignore
                        if (error.response?.status === 403) {
                            localStorage.removeItem("accessToken");
                            router.push("/login");
                        }
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        )

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        }
    },[generateRefreshToken]);
    return axiosInstance;
};

export default useAxios;