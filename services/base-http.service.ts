import baseURL from "@/baseUrl";
import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
import { useRouter } from 'next/navigation';
export const axiosInstance = axios.create({
    //baseURL: baseURL, // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials:false,
});

axiosInstance.interceptors.request.use(
    (config) => {
      const token = Cookies.get('session'); // Replace with your token retrieval logic
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

let isRefreshing = false;
let failedQueue:any[] = [];

const processQueue = (error:any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
  
  // Response interceptor to handle 401 errors
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const originalRequest = error.config;
  
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
  
        originalRequest._retry = true;
        isRefreshing = true;
  
        return new Promise((resolve, reject) => {
          // Replace with your token refresh logic
          axios
            .post('/api/auth/refresh-token', {
              refresh_token: Cookies.get('refreshToken'),
              session_token: Cookies.get('session')
            })
            .then(({ data }) => {
                console.log("SETTING: ", data);
               const expTime = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365); 
              Cookies.set('session', data.session, {expires: expTime}); // Replace with your token storage logic
              axiosInstance.defaults.headers['Authorization'] =
                'Bearer ' + data.session;
              originalRequest.headers['Authorization'] =
                'Bearer ' + data.session;
              processQueue(null, data.session);
              resolve(axiosInstance(originalRequest));
            })
            .catch((err) => {
              processQueue(err, null);
              Cookies.remove('session');
              Cookies.remove('refreshToken');
              window.location.href = '/login';
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }
      if(originalRequest._retry && error.response.status === 401){
         Cookies.remove('session');
         Cookies.remove('refreshToken');
         window.location.href = '/login';
         return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );