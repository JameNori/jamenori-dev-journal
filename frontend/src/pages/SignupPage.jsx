import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { FormInput } from "../components/ui/FormInput";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    // Clear previous errors
    setErrors({});

    try {
      // TODO: Add actual signup API call here
      console.log("Sign up form submitted:", formData);

      // Simulate API call
      // const response = await axios.post('/api/signup', formData);

      // For testing: Simulate success after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - redirect to success page
      navigate("/signup/success");
    } catch (error) {
      console.error("Signup error:", error);

      // Check if error is from API response
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "";

      // Check if it's an email already taken error
      const emailErrorKeywords = [
        "email",
        "already",
        "taken",
        "exists",
        "duplicate",
      ];
      const isEmailError = emailErrorKeywords.some((keyword) =>
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isEmailError) {
        // Show inline error for email field
        setErrors({
          email: "Email is already taken, Please try another email.",
        });
      } else {
        // Show general error message
        setErrors({
          submit: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brown-100">
      <NavBar />

      <main className="flex items-center justify-center bg-brown-100 min-h-[80vh] px-4 py-8">
        {/* Sign Up Form Card */}
        <div className="w-full max-w-[344px] lg:max-w-[798px]">
          <div className="bg-brown-200 rounded-2xl pt-10 px-4 pb-10 pl-4 shadow-lg lg:pt-15 lg:px-30 lg:pb-15 lg:pl-30">
            <div className="flex flex-col">
              {/* Title */}
              <h1 className="text-center font-poppins text-[40px] font-semibold text-brown-600 mb-8 leading-12">
                Sign up
              </h1>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6 lg:gap-10"
              >
                {/* Name Field */}
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  label="Name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />

                {/* Username Field */}
                <FormInput
                  id="username"
                  name="username"
                  type="text"
                  label="Username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username}
                  required
                />

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

                {/* Error Message */}
                {errors.submit && (
                  <div className="text-center">
                    <p className="text-sm text-red-500">{errors.submit}</p>
                  </div>
                )}

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mx-auto h-12 rounded-full bg-brown-600 px-[42px] py-3 font-poppins text-base font-medium text-white transition-colors duration-200 hover:bg-brown-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-8">
                <p className="font-poppins text-base font-medium leading-6 text-brown-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-poppins text-base font-medium leading-6 underline transition-colors text-brown-600"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
