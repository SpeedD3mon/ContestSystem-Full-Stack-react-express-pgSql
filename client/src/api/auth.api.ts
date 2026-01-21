import api from "./axios";


export const loginRequest = async (email: string, password: string): Promise<AuthUser> => {
  const res = await api.post("/users/login", { email, password });
  return res.data;
};

export const registerRequest = async (email: string, password: string) => {
  return api.post("/users/register", { email, password });
};

export const refreshTokenRequest = async (): Promise<{ access_token: string; refresh_token: string }> => {
  const res = await api.post("/users/refresh-token"); 
  // usually refresh token is sent automatically via HttpOnly cookie
  return res.data;
};