import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// GET /books and GET /books/:id are public on the server, so no token is needed.
function isPublicRequest(config: InternalAxiosRequestConfig) {
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";
  return method === "get" && url.startsWith("/books");
}

api.interceptors.request.use(async (config) => {
  if (isPublicRequest(config)) return config;

  try {
    const response = await fetch("/api/token", { cache: "no-store" });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        config.headers.Authorization = `Bearer ${data.token}`;
      }
    }
  } catch {
    // If the token request fails, the server will answer 401 and the UI shows a toast.
  }

  return config;
});

export default api;