import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserNavBar } from "../components/UserNavBar";
import { Footer } from "../components/Footer";
import { FormInput } from "../components/ui/FormInput";
import { ErrorPopup } from "../components/ui/ErrorPopup";
import { authService } from "../services/auth.service.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // เรียก API login
      await authService.login(formData.email, formData.password);

      // Login สำเร็จ - ดึงข้อมูล user เพื่อเช็ค role
      const userData = await authService.getCurrentUser();

      // Redirect ตาม role
      if (userData.role === "admin") {
        navigate("/admin/article-management");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      // แสดง error จาก API
      const errorMessage =
        error?.response?.data?.error ||
        "Your password is incorrect or this email doesn't exist";

      setErrors({
        submit: errorMessage,
        submitDescription: "Please try another password or email",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brown-100">
      <UserNavBar />

      <main className="flex items-center justify-center bg-brown-100 min-h-[80vh] px-4 py-8">
        {/* Login Form Card */}
        <div className="w-full max-w-[344px] lg:max-w-[798px]">
          <div className="bg-brown-200 rounded-2xl pt-10 px-4 pb-10 pl-4 shadow-lg lg:pt-15 lg:px-30 lg:pb-15 lg:pl-30">
            <div className="flex flex-col">
              {/* Title */}
              <h1 className="text-center font-poppins text-[40px] font-semibold text-brown-600 mb-8 leading-12">
                Log in
              </h1>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6 lg:gap-10"
              >
                {/* Email Field */}
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />

                {/* Password Field */}
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  required
                />

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mx-auto h-12 rounded-full bg-brown-600 px-[42px] py-3 font-poppins text-base font-medium text-white transition-colors duration-200 hover:bg-brown-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-8">
                <p className="font-poppins text-base font-medium leading-6 text-brown-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-poppins text-base font-medium leading-6 underline transition-colors text-brown-600"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Error Popup */}
      <ErrorPopup
        message={errors.submit}
        description={errors.submitDescription}
        isVisible={!!errors.submit}
        onClose={() =>
          setErrors((prev) => ({ ...prev, submit: "", submitDescription: "" }))
        }
      />
    </div>
  );
}
