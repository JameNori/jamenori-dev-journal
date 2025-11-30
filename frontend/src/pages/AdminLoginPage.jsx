import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../components/ui/FormInput";
import { ErrorPopup } from "../components/ui/ErrorPopup";
import { authService } from "../services/auth.service.js";

export default function AdminLoginPage() {
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

    // ล้าง error เมื่อผู้ใช้เริ่มพิมพ์
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

      // ตรวจสอบว่าเป็น admin หรือไม่
      if (userData.role !== "admin") {
        setErrors({
          submit: "You do not have admin access",
          submitDescription: "Please use a different account",
        });
        authService.logout(); // ลบ token
        return;
      }

      // Redirect ไปหน้า admin
      navigate("/admin/article-management");
    } catch (error) {
      console.error("Admin login error:", error);

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
      <main className="flex items-center justify-center min-h-screen bg-brown-100">
        <div className="w-full max-w-[798px]">
          <div className="bg-brown-200 rounded-2xl pt-15 px-30 pb-15 pl-30 shadow-lg">
            <div className="flex flex-col">
              <p className="mb-2 text-center font-poppins text-sm font-normal text-orange">
                Admin panel
              </p>

              <h1 className="mb-8 text-center font-poppins text-[40px] font-semibold leading-12 text-brown-600">
                Log in
              </h1>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-10"
              >
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mx-auto flex h-12 items-center justify-center rounded-full bg-brown-600 px-[42px] py-3 font-poppins text-base font-medium text-white transition-colors duration-200 hover:bg-brown-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

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
