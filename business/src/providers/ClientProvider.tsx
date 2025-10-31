import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth/AuthProvider";
import { ThemeProvider } from "@/contexts/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

type ClientProviderProps = {
  children: React.ReactNode;
};

export const ClientProvider = ({ children }: ClientProviderProps) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
