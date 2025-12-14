import { useState } from "react";
import { AdminNavBar } from "../../components/AdminNavBar";
import { FormInput } from "../../components/ui/FormInput";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { authService } from "../../services/auth.service.js";

export default function AdminResetPasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      // เรียก API reset password
      await authService.resetPassword(
        formData.currentPassword,
        formData.newPassword
      );

      // Show success modal
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Auto hide success modal after 5 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 5000);
    } catch (error) {
      console.error("Reset password error:", error);

      const errorMessage =
        error?.response?.data?.error ||
        "Failed to reset password. Please try again.";

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReset = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar
        title="Reset password"
        actionButton={{
          label: "Reset password",
          onClick: handleSubmit,
          disabled: isSubmitting,
          showIcon: false,
          loadingText: isSubmitting ? "Resetting..." : undefined,
        }}
      />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FormInput
            id="currentPassword"
            name="currentPassword"
            type="password"
            label="Current password"
            placeholder="Current password"
            value={formData.currentPassword}
            onChange={handleInputChange}
            error={errors.currentPassword}
            required
            className="w-[480px] [&_label]:mb-1 [&_label]:leading-6 [&_input]:font-medium [&_input]:leading-6 [&_input]:text-brown-500 [&_input]:py-3 [&_input]:pl-4 [&_input]:pr-3 [&_input]:px-0"
          />

          <FormInput
            id="newPassword"
            name="newPassword"
            type="password"
            label="New password"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleInputChange}
            error={errors.newPassword}
            required
            className="w-[480px] [&_label]:mb-1 [&_label]:leading-6 [&_input]:font-medium [&_input]:leading-6 [&_input]:text-brown-500 [&_input]:py-3 [&_input]:pl-4 [&_input]:pr-3 [&_input]:px-0"
          />

          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
            className="w-[480px] [&_label]:mb-1 [&_label]:leading-6 [&_input]:font-medium [&_input]:leading-6 [&_input]:text-brown-500 [&_input]:py-3 [&_input]:pl-4 [&_input]:pr-3 [&_input]:px-0"
          />
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={showConfirmModal}
        onClose={handleCancelReset}
        onConfirm={handleConfirmReset}
        title="Reset password"
        message="Do you want to reset your password?"
        confirmButtonText="Reset"
      />

      {/* Success Modal */}
      <SuccessModal
        isVisible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Password reset"
        description="Your password has been successfully reset"
      />
    </div>
  );
}
