import api from "@/utils/axios";

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
  };
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await api.post("/admin/login", data);
  return res.data;
}

export async function logout(): Promise<LogoutResponse> {
  const res = await api.post("/admin/logout");
  return res.data;
}

export async function checkAuth(): Promise<AuthResponse> {
  const res = await api.get("/admin");
  return res.data;
}
