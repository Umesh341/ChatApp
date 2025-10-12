import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true,
    
});

export default axiosInstance
