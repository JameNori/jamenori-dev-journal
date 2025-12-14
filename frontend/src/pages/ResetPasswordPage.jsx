import { useState, useEffect } from "react";
import { ProfileNavBar } from "../components/ProfileNavBar";
import { ProfileSidebar } from "../components/ProfileSidebar";
import { FormInput } from "../components/ui/FormInput";
import { ProfileSuccessModal } from "../components/ui/ProfileSuccessModal";
import { ErrorPopup } from "../components/ui/ErrorPopup";
import { User } from "lucide-react";
import { authService } from "../services/auth.service.js";
import { profileService } from "../services/profile.service.js";

export default function ResetPasswordPage() {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    avatar: null,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ดึงข้อมูล profile เมื่อ component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching profile...");
        const profile = await profileService.getProfile();
        console.log("Profile data:", profile);

        const profileData = {
          name: profile.name || "",
          username: profile.username || "",
          email: profile.email || "",
          avatar: profile.profilePic || null,
        };

        setUserData(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        console.error("Error response:", error.response);
        setError(
          error.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
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
    setError(null);

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

      // Auto hide after 5 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 5000);
    } catch (error) {
      console.error("Password reset error:", error);
      console.error("Error response:", error.response);

      const errorMessage =
        error?.response?.data?.error ||
        "Failed to reset password. Please try again.";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brown-100">
      <ProfileNavBar
        userName={userData.name || "Loading..."}
        userAvatar={userData.avatar}
      />

      <div className="lg:px-[120px] lg:py-12">
        <div className="mx-auto w-full max-w-[1120px] space-y-6 lg:space-y-8 bg-brown-100">
          {/* Mobile navigation */}
          <ProfileSidebar variant="mobile" className="lg:hidden" />

          {/* Profile header */}
          <section className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-5 lg:pl-[150px]">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-brown-200 lg:h-[60px] lg:w-[60px]">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brown-300">
                    <User className="h-8 w-8 text-brown-600" />
                  </div>
                )}
              </div>
              <div className="flex min-w-0 items-center gap-4">
                <span className="truncate font-poppins text-xl font-semibold leading-7 text-brown-400 lg:text-2xl lg:leading-8">
                  {userData.name || "Loading..."}
                </span>
                <span className="flex items-center gap-4 whitespace-nowrap font-poppins text-xl font-semibold leading-7 text-brown-600 lg:text-2xl lg:leading-8">
                  <span className="h-7 border-l border-brown-300 lg:h-8" />
                  <span>Reset password</span>
                </span>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
            <ProfileSidebar className="hidden lg:block lg:w-[240px] lg:flex-none" />

            <main className="space-y-6 lg:w-[550px] lg:flex-none lg:space-y-8">
              {/* Error Popup */}
              {error && (
                <ErrorPopup message={error} onClose={() => setError(null)} />
              )}

              {/* Loading State */}
              {isLoading && !userData.name ? (
                <section className="w-full lg:rounded-2xl bg-brown-200 px-4 pb-10 pt-6 shadow-lg lg:px-10 lg:py-10">
                  <div className="flex items-center justify-center py-8">
                    <p className="font-poppins text-base font-medium text-brown-400">
                      Loading profile...
                    </p>
                  </div>
                </section>
              ) : (
                /* Reset password form */
                <section className="w-full lg:rounded-2xl bg-brown-200 px-4 pb-10 pt-6 shadow-lg lg:px-10 lg:py-10">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 lg:gap-7"
                  >
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
                      disabled={isSubmitting || isLoading}
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
                      disabled={isSubmitting || isLoading}
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
                      disabled={isSubmitting || isLoading}
                    />

                    {errors.submit && (
                      <div className="text-center">
                        <p className="font-poppins text-sm text-red">
                          {errors.submit}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-start">
                      <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="flex h-12 w-[208px] items-center justify-center whitespace-nowrap rounded-full bg-brown-600 px-10 font-poppins text-base font-medium leading-6 text-white transition-colors duration-200 hover:bg-brown-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? "Resetting..." : "Reset password"}
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ProfileSuccessModal
        isVisible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-poppins text-2xl font-semibold text-brown-600">
                Reset password
              </h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-brown-400 transition-colors hover:bg-brown-100 hover:text-brown-600"
                aria-label="Close modal"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-6 font-poppins text-base font-medium text-brown-400">
              Do you want to reset your password?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-full border-2 border-brown-300 bg-white font-poppins text-base font-medium text-brown-600 transition-colors hover:bg-brown-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={isSubmitting}
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-brown-600 font-poppins text-base font-medium text-white transition-colors hover:bg-brown-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
