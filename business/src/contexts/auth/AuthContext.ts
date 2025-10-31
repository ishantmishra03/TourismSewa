import { createContext } from "react";

export interface User {
  id: string;
  name: string;
}

export interface AuthContextState {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState: AuthContextState = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  // -- Disabling ---
  loading: false,
  setLoading: () => {},
  // --- Loader ---
  isLoading: false,
  setIsLoading: () => {},
};

export const AuthContext = createContext<AuthContextState>(initialState);
