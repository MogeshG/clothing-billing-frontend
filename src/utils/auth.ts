export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export const verifyToken = async (): Promise<boolean> => {
  // JWT auth disabled - always return true
  // const token = getToken();
  // if (!token) return false;
  //
  // try {
  //   const response = await axios.get(`${API_BASE}/api/verify-token`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   return response.data.success; // Assume { success: true }
  // } catch {
  //   removeToken();
  //   return false;
  // }
  return true;
};
