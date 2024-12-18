import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true
});

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});