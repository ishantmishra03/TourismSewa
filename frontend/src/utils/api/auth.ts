import api from "../../config/axios";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  nationality: string;
  gender: "male" | "female" | "other" | string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
  } | null;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Login function
export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await api.post("/auth/login", data);
  return res.data;
}

// Register function
export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await api.post("/auth/register", data);
  return res.data;
}

// Logout function
export async function logout(): Promise<LogoutResponse> {
  const res = await api.post("/auth/logout");
  return res.data;
}

// Check auth status
export async function checkAuth(): Promise<AuthResponse> {
  const res = await api.get("/auth");
  return res.data;
}
