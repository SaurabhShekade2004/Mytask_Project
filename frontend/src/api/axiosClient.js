import axios from "axios";

// Create axios instance
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Always attach token if exists
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
