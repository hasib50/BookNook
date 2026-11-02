import axios from "axios";
import { authClient } from "@/lib/auth-client";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000" });

api.interceptors.request.use(async config => {
  const response = await fetch("/api/token", { cache: "no-store" });
  if (response.ok) {
    const data = await response.json();
    if (data.token) config.headers.Authorization = `Bearer ${data.token}`;
  }
  return config;
});

export default api;
