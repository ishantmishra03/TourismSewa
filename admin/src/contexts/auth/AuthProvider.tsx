import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextState, type User } from "./AuthContext";
import { isAxiosError } from "axios";
import { checkAuth } from "@/utils/api/auth";
import Loader from "@/components/Loader";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // --- LOader component ---
  const [isLoading, setIsLoading] = useState(true);
  // --- Button disabling ---
  const [loading, setLoading] = useState(false);

  // --- IF permitted or not ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await checkAuth();

        if (data.success) {
          setIsAuthenticated(true);
          setUser(data.user);
        }
      } catch (error) {
        let message = "Something went wrong";

        if (isAxiosError(error) && error.response?.data.message) {
          message = error.response?.data.message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        console.log(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value: AuthContextState = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    loading,
    setLoading,
    isLoading,
    setIsLoading,
  };

  // --- Loader ---
  if (isLoading) {
    return <Loader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
