import React from "react";
import { AuthProvider } from "../contexts/auth/AuthProvider";
import { ThemeProvider } from "../contexts/theme/ThemeProvider";
import { Toaster } from "../components/ui/sonner";

type ClientProviderProps = {
  children: React.ReactNode;
};

export const ClientProvider = ({ children }: ClientProviderProps) => {
  return (
    
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </AuthProvider>
  );
};
