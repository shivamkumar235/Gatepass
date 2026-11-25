import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Har request se pehle token laga do
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Token expire ya account band ho toh wapas login par bhejo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall =
      error.config && error.config.url.includes("/auth/login");
    if (error.response && error.response.status === 401 && !isLoginCall) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
