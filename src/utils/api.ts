import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    throw new Error(
      error.response?.data?.message || error.message || "API error",
    );
  },
);

// export const apiCall = async (
//   endpoint: string,
//   options: { method?: string; data?: Record<string, unknown> } = {},
// ) => {
//   const { method = "GET", data } = options;
//   const config = { method, data };
//   const response = await api(endpoint, config);
//   return response.data;
// };

export default api;
