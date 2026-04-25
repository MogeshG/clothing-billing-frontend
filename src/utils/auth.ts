import api from "./api";

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const verifyToken = async (): Promise<{ valid: boolean; user: any | null }> => {
  const token = getToken();
  if (!token) return { valid: false, user: null };

  try {
    const response = await api.get("/auth/me");
    return { valid: true, user: response.data.user };
  } catch {
    removeToken();
    return { valid: false, user: null };
  }
};

