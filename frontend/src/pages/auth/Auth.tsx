import InputField from "../../components/extra/form/Input";
import SelectField from "../../components/extra/form/Select";
import { useAuth } from "../../contexts/auth/useAuth";
import { login, register, type RegisterData } from "../../utils/api/auth";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Auth() {
  const navigate = useNavigate();
  const { setIsAuthenticated, loading, setLoading, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    nationality: "",
    gender: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: RegisterData) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be 6+ characters";

    if (!isLogin) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.contactNumber)
        newErrors.contactNumber = "Contact Number is required";
      if (!formData.nationality)
        newErrors.nationality = "Nationality is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const data = isLogin
        ? await login({
            email: formData.email,
            password: formData.password,
          })
        : await register(formData);

      if (data.success) {
        toast.success(data.message);
        setIsAuthenticated(true);
        setUser(data.user);
        navigate("/map");
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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="md:flex md:flex-wrap md:-mx-2">
              <div className="md:w-1/2 md:px-2 mb-4">
                <InputField
                  label="Name"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.name}
                />
              </div>
              <div className="md:w-1/2 md:px-2 mb-4">
                <InputField
                  label="Contact Number"
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+977 9812345678"
                  error={errors.contactNumber}
                />
              </div>
              <div className="md:w-1/2 md:px-2 mb-4">
                <InputField
                  label="Nationality"
                  id="nationality"
                  name="nationality"
                  type="text"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Nepali"
                  error={errors.nationality}
                />
              </div>
              <div className="md:w-1/2 md:px-2 mb-4">
                <SelectField
                  label="Gender"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  options={[
                    { value: "", label: "Select gender" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </div>
            </div>
          )}

          <InputField
            label="Email address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
          />

          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete={isLogin ? "current-password" : "new-password"}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            disabled={loading}
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="text-teal-600 dark:text-teal-400 font-semibold hover:underline focus:outline-none"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
