import { useState, useEffect, useRef } from "react";
import { ProfileNavBar } from "../components/ProfileNavBar";
import { ProfileSidebar } from "../components/ProfileSidebar";
import { FormInput } from "../components/ui/FormInput";
import { ProfileSuccessModal } from "../components/ui/ProfileSuccessModal";
import { ErrorPopup } from "../components/ui/ErrorPopup";
import { User } from "lucide-react";
import { profileService } from "../services/profile.service.js";
import { TrashIcon } from "../components/icons/TrashIcon";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    avatar: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);

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
        setFormData({
          name: profileData.name,
          username: profileData.username,
          email: profileData.email,
        });

        // ถ้ามี profile picture ให้แสดง
        if (profile.profilePic) {
          setProfilePic(profile.profilePic);
          setImagePreview(profile.profilePic);
        }
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

  // ฟังก์ชันสำหรับจัดการเมื่อมีการเลือกไฟล์
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // ตรวจสอบประเภทของไฟล์
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, WebP).");
      return;
    }

    // ตรวจสอบขนาดของไฟล์ (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(
        "The file is too large. Please upload an image smaller than 5MB."
      );
      return;
    }

    // เก็บข้อมูลไฟล์
    setImageFile(file);
    setError(null);

    // สร้าง preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // ฟังก์ชันสำหรับลบรูปภาพ
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
    setError(null);

    try {
      // สร้าง FormData สำหรับการส่งข้อมูลแบบ multipart/form-data
      const formDataToSend = new FormData();

      // เพิ่มข้อมูลทั้งหมดลงใน FormData
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);

      // ถ้ามีไฟล์ใหม่ที่เลือก → ส่งไฟล์
      if (imageFile) {
        formDataToSend.append("imageFile", imageFile);
      } else if (profilePic) {
        // ถ้าไม่มีไฟล์ใหม่ แต่มีรูปเดิม → ส่ง URL เดิม
        formDataToSend.append("image", profilePic);
      }

      console.log("Updating profile:", {
        name: formData.name,
        username: formData.username,
        hasImageFile: !!imageFile,
        hasProfilePic: !!profilePic,
      });

      const response = await profileService.updateProfile(formDataToSend);
      console.log("Update response:", response);

      // อัปเดต userData จาก response
      if (response.profile) {
        const updatedData = {
          name: response.profile.name || formData.name,
          username: response.profile.username || formData.username,
          email: response.profile.email || formData.email,
          avatar: response.profile.profilePic || profilePic,
        };

        setUserData(updatedData);

        // อัปเดต profile picture
        if (response.profile.profilePic) {
          setProfilePic(response.profile.profilePic);
          setImagePreview(response.profile.profilePic);
        }
      }

      // Clear imageFile เพราะอัปโหลดเสร็จแล้ว
      setImageFile(null);

      // Show success modal
      setShowSuccessModal(true);

      // Auto hide after 5 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 5000);
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Error response:", error.response);
      setError(
        error.response?.data?.message ||
          `Failed to update profile: ${error.message || "Unknown error"}`
      );
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
                {userData.avatar || imagePreview ? (
                  <img
                    src={imagePreview || userData.avatar}
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
                  <span>Profile</span>
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
                /* Profile form */
                <section className="w-full lg:rounded-2xl bg-brown-200 px-4 pb-10 pt-6 shadow-lg lg:px-10 lg:py-10">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 lg:gap-10"
                  >
                    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center">
                      <div className="relative">
                        {imagePreview || userData.avatar ? (
                          <div className="relative">
                            <img
                              src={imagePreview || userData.avatar}
                              alt={userData.name || "Profile"}
                              className="h-30 w-30 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback =
                                  e.currentTarget.parentElement.nextElementSibling;
                                if (fallback instanceof HTMLElement) {
                                  fallback.style.display = "flex";
                                }
                              }}
                            />
                            {imagePreview && (
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute right-2 top-2 z-10 h-6 w-6 rounded-full bg-red-500 p-0 flex items-center justify-center text-white transition-colors hover:bg-red-600"
                                title="Remove image"
                              >
                                <TrashIcon
                                  className="h-5 w-5"
                                  stroke="currentColor"
                                />
                              </button>
                            )}
                          </div>
                        ) : null}
                        <div
                          className={`flex h-30 w-30 items-center justify-center rounded-full bg-brown-300 ${
                            imagePreview || userData.avatar ? "hidden" : ""
                          }`}
                        >
                          <User className="h-12 w-12 text-brown-600 lg:h-14 lg:w-14" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 lg:gap-3">
                        <input
                          id="avatar-upload"
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          disabled={isSubmitting || isLoading}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer rounded-full border border-brown-400 bg-white px-10 py-3 font-poppins text-base font-medium text-brown-600 transition-colors hover:bg-brown-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {imagePreview || userData.avatar
                            ? "Change profile picture"
                            : "Upload profile picture"}
                        </label>
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
                        disabled={isSubmitting || isLoading}
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
                        disabled={isSubmitting || isLoading}
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
                        disabled={isSubmitting || isLoading}
                        className="flex h-12 w-[120px] items-center justify-center rounded-full bg-brown-600 px-10 font-poppins text-base font-medium leading-6 text-white transition-colors duration-200 hover:bg-brown-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                </section>
              )}
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
