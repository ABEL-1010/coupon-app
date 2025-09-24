import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // comes from .env
});

// Auth APIs
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
