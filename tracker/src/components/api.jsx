import axios from "axios";

const api = axios.create({
  baseURL: "https://remotework-tracker-backend.onrender.com/api",
  withCredentials: true, // only needed if cookies are used
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
