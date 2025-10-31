import type { AxiosInstance } from "axios";
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL as string;

if (!baseURL) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
