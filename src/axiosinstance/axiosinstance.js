// src/axiosInstance.js
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    // Add other configurations like timeout, headers, etc., if needed
});

// Request interceptor to add token to the headers
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            
            try {
                const res = await axios.post(BASE_URL+'token/refresh/', { refresh: refreshToken });
                if (res.status === 200) {
                    const newAccessToken = res.data.access;
                    const newRefreshToken = res.data.refresh;

                    localStorage.setItem('access_token', newAccessToken);
                    localStorage.setItem('refresh_token', newRefreshToken);
                    
                    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;

                    // Retry the original request with the new token
                    return axiosInstance(originalRequest);
                }
            } catch (err) {
                console.error("Refresh token error:", err);
                // Handle error, possibly redirect to login
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;