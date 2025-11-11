import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

console.log("BASE URL ",baseURL)

const api = axios.create({
    baseURL,
    headers:{
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api