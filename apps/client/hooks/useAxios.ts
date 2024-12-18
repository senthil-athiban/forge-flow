import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken"
import { axiosInstance } from "@/lib/axios";

const useAxios = () => {
    const generateRefreshToken = useRefreshToken();

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                if(!config.headers["Authorization"]) {
                    config.headers["Authorization"] = localStorage.getItem('token');
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
                    const response = await generateRefreshToken();
                    //@ts-ignore
                    const newAccessToken = response?.message?.accesstoken;
                    localStorage.setItem('token', newAccessToken);
                    prevRequest.headers["Authorization"] = `${newAccessToken}`;
                    return axiosInstance(prevRequest);
                }
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