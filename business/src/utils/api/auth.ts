import api from "@/utils/axios";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  contactNumber: string;
  address: string;
  description: string;
  categories: string[];
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
  const res = await api.post("/auth2/login", data);
  return res.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await api.post("/auth2/register", data);
  return res.data;
}

export async function logout(): Promise<LogoutResponse> {
  const res = await api.post("/auth2/logout");
  return res.data;
}

export async function checkAuth(): Promise<AuthResponse> {
  const res = await api.get("/auth2");
  return res.data;
}
