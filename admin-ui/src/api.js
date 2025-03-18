import axios from "axios";

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL, // Use API base URL from .env
  withCredentials: true, // Automatically send cookies
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

export default api;