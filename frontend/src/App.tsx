import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { Navbar } from "./components/layout/Navbar";
import PublicRoute from "./components/security/PublicRoute";
import { Auth } from "./pages/auth/Auth";
import ProtectedRoute from "./components/security/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NotFound from "./components/extra/NotFound";

const App: React.FC = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route element={<PublicRoute />}>
              <Route path="/auth" element={<Auth />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
