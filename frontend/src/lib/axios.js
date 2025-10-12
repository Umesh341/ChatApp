import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ?'http://localhost:5001/api' :"/api",
    withCredentials: true,
    
});


axiosInstance.interceptors.response.use(
  res => res,
  error => {
    const status = error.response?.status;

    if (status === 401) {
      // If it's an "expected" unauthenticated check, be silent:
      if (error.config && error.config.url?.includes('/auth/check-auth')) {
        // Do nothing (no console.error)
      } else {
        // Unexpected 401 from other endpoints — inform user + redirect
        toast.error('Session expired. Please log in again.');
        // avoid infinite redirect loops (only redirect if not already on login)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    // Propagate the rejection for component-level handling if necessary
    return Promise.reject(error);
  }
);

export default axiosInstance
