import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  MapPin,
  FileText,
  Tag,
  Loader2,
} from "lucide-react";
import { login, register, type RegisterData } from "@/utils/api/auth";
import { isAxiosError } from "axios";
import { useAuth } from "@/contexts/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  "Adventure",
  "Cultural",
  "Food & Dining",
  "Wellness",
  "Nature",
  "Entertainment",
  "Sports",
  "Education",
];

export default function BusinessAuth() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    businessName: "",
    contactNumber: "",
    address: "",
    description: "",
    categories: [],
  });
  const [loginErrors, setLoginErrors] = useState<Partial<typeof loginData>>({});
  const [registerErrors, setRegisterErrors] = useState<Partial<RegisterData>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  // Login handlers
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name as keyof typeof loginData]) {
      setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateLogin = () => {
    const newErrors: Partial<typeof loginData> = {};
    if (!loginData.email) newErrors.email = "Email is required";
    if (!loginData.password) newErrors.password = "Password is required";
    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const data = await login({
        email: loginData.email,
        password: loginData.password,
      });

      if (data.success) {
        toast.success(data.message);
        setIsAuthenticated(true);
        setUser(data.user);
        navigate("/profile");
      }
    } catch (error: unknown) {
      let message = "Something went wrong";

      if (isAxiosError(error) && error.response?.data.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Register handlers
  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (registerErrors[name as keyof RegisterData]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCategoryToggle = (category: string) => {
    setRegisterData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    if (registerErrors.categories) {
      setRegisterErrors((prev) => ({ ...prev, categories: undefined }));
    }
  };

  const validateRegister = () => {
    const newErrors: Partial<RegisterData> = {};
    if (!registerData.name) newErrors.name = "Name is required";
    if (!registerData.email) newErrors.email = "Email is required";
    if (!registerData.password) newErrors.password = "Password is required";
    if (registerData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!registerData.businessName)
      newErrors.businessName = "Business name is required";
    if (!registerData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!registerData.address) newErrors.address = "Address is required";
    if (!registerData.description)
      newErrors.description = "Description is required";
    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setLoading(true);
    try {
      const data = await register(registerData);

      if (data.success) {
        toast.success(data.message);
        setIsAuthenticated(true);
        setUser(data.user);
        navigate("/profile");
      }
    } catch (error: unknown) {
      let message = "Something went wrong";

      if (isAxiosError(error) && error.response?.data.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className={`mx-auto ${isLogin ? "max-w-md" : "max-w-3xl"}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-600 dark:bg-teal-700 mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? "Business Login" : "Register Your Business"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin
              ? "Sign in to manage your experiences"
              : "Start offering amazing experiences to travelers"}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 flex gap-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all ${
              isLogin
                ? "bg-teal-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all ${
              !isLogin
                ? "bg-teal-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="login-email"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="business@example.com"
                    className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      loginErrors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </div>
                {loginErrors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {loginErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      loginErrors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {loginErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Register Form */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        placeholder="John Doe"
                        className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          registerErrors.name
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {registerErrors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {registerErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="register-email"
                      className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="business@example.com"
                        className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          registerErrors.email
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {registerErrors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {registerErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="register-password"
                    className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      id="register-password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="••••••••"
                      className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        registerErrors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                  </div>
                  {registerErrors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {registerErrors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Business Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Business Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        value={registerData.businessName}
                        onChange={handleRegisterChange}
                        placeholder="Adventure Tours Nepal"
                        className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          registerErrors.businessName
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {registerErrors.businessName && (
                      <p className="mt-1 text-xs text-red-500">
                        {registerErrors.businessName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contactNumber"
                        className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Contact Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                          id="contactNumber"
                          name="contactNumber"
                          type="tel"
                          value={registerData.contactNumber}
                          onChange={handleRegisterChange}
                          placeholder="+977 9812345678"
                          className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                            registerErrors.contactNumber
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        />
                      </div>
                      {registerErrors.contactNumber && (
                        <p className="mt-1 text-xs text-red-500">
                          {registerErrors.contactNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={registerData.address}
                          onChange={handleRegisterChange}
                          placeholder="Thamel, Kathmandu"
                          className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                            registerErrors.address
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        />
                      </div>
                      {registerErrors.address && (
                        <p className="mt-1 text-xs text-red-500">
                          {registerErrors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Business Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <textarea
                        id="description"
                        name="description"
                        value={registerData.description}
                        onChange={handleRegisterChange}
                        placeholder="Tell us about your business..."
                        rows={4}
                        className={`w-full rounded-lg border pl-11 pr-3 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          registerErrors.description
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {registerErrors.description && (
                      <p className="mt-1 text-xs text-red-500">
                        {registerErrors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Tag className="inline w-4 h-4 mr-1.5 -mt-0.5" />
                      Business Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategoryToggle(category)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            registerData.categories.includes(category)
                              ? "bg-teal-600 text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    {registerErrors.categories && (
                      <p className="mt-2 text-xs text-red-500">
                        {registerErrors.categories}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Business Account"
                )}
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 Your data is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
