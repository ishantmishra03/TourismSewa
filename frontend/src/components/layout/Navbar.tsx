import { useState } from "react";
import {
  Menu,
  X,
  Mountain,
  Sun,
  Moon,
  Home,
  Briefcase,
  Calendar,
  Ticket,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/auth/useAuth";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { logout } from "../../utils/api/auth";
import { useTheme } from "../../contexts/theme/useTheme";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    {
      id: "experiences",
      label: "Experiences",
      icon: Calendar,
      path: "/experiences",
    },
    {
      id: "businesses",
      label: "Businesses",
      icon: Briefcase,
      path: "/businesses",
    },
    ...(isAuthenticated
      ? [
          {
            id: "bookings",
            label: "Bookings",
            icon: Ticket,
            path: "/bookings",
          },
        ]
      : []),
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      const data = await logout();
      if (data.success) {
        toast.success(data.message);
        setIsAuthenticated(false);
        setUser(null);
        navigate("/auth");
      }
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (isAxiosError(error) && error.response?.data.message) {
        message = error.response?.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick("/")}
          >
            <Mountain className="w-8 h-8 text-teal-600 group-hover:text-teal-700 transition-colors" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              TourismSewa
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Theme toggle */}
            <button
              onClick={handleThemeChange}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Logout button if authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleThemeChange}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}

            {/* Logout button in mobile menu */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
