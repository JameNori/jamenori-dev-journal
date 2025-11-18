import { useState } from "react";
import { ProfileNavBar } from "../components/ProfileNavBar";
import { ProfileSidebar } from "../components/ProfileSidebar";
import { FormInput } from "../components/ui/FormInput";
import { ProfileSuccessModal } from "../components/ui/ProfileSuccessModal";
import { User } from "lucide-react";

export default function ProfilePage() {
  // Mock data - จะเปลี่ยนเป็น API call เมื่อ Backend พร้อม
  const [userData, setUserData] = useState({
    name: "Jame Nori",
    username: "jame.nori",
    email: "jame_nori@hotmail.com",
    avatar: "/src/assets/images/profile-cat.webp", // รูปแมวที่ผู้ใช้ให้มา
  });

  const [formData, setFormData] = useState({
    name: userData.name,
    username: userData.username,
    email: userData.email,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // ใน production จะต้อง upload ไปที่ server
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      console.log("Profile update:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update userData
      setUserData((prev) => ({
        ...prev,
        ...formData,
      }));

      // Show success modal
      setShowSuccessModal(true);

      // Auto hide after 5 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 5000);
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({
        submit: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brown-100">
      <ProfileNavBar userName={userData.name} userAvatar={userData.avatar} />

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
                    alt={userData.name}
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
                  {userData.name}
                </span>
                <span className="flex items-center gap-4 whitespace-nowrap font-poppins text-xl font-semibold leading-7 text-brown-600 lg:text-2xl lg:leading-8">
                  <span className="h-7 border-l border-brown-300 lg:h-8" />
                  <span>Profile</span>
                </span>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
            <ProfileSidebar className="hidden lg:block lg:w-[240px] lg:flex-none" />

            <main className="space-y-6 lg:w-[550px] lg:flex-none lg:space-y-8">
              {/* Profile form */}
              <section className="w-full lg:rounded-2xl bg-brown-200 px-4 pb-10 pt-6 shadow-lg lg:px-10 lg:py-10">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6 lg:gap-10"
                >
                  <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center">
                    <div className="relative">
                      {userData.avatar ? (
                        <img
                          src={userData.avatar}
                          alt={userData.name}
                          className="h-30 w-30 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback instanceof HTMLElement) {
                              fallback.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`flex h-30 w-30 items-center justify-center rounded-full bg-brown-300 ${
                          userData.avatar ? "hidden" : ""
                        }`}
                      >
                        <User className="h-12 w-12 text-brown-600 lg:h-14 lg:w-14" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 lg:gap-3">
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer rounded-full border border-brown-400 bg-white px-10 py-3 font-poppins text-base font-medium text-brown-600 transition-colors hover:bg-brown-100"
                      >
                        Upload profile picture
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-brown-300 lg:my-1" />

                  <div className="flex flex-col gap-6 lg:gap-7">
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
                    <div className="pb-2">
                      <label
                        htmlFor="email"
                        className="mb-2 block font-poppins text-base font-medium text-brown-400"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="h-12 w-full px-4 py-3 font-poppins text-brown-400"
                      />
                    </div>
                    {errors.submit && (
                      <div className="text-center">
                        <p className="font-poppins text-sm text-red-500">
                          {errors.submit}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-start">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex h-12 w-[120px] items-center justify-center rounded-full bg-brown-600 px-10 font-poppins text-base font-medium leading-6 text-white transition-colors duration-200 hover:bg-brown-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </section>
            </main>
          </div>
        </div>

        {/* Success Modal */}
        <ProfileSuccessModal
          isVisible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </div>
  );
}
