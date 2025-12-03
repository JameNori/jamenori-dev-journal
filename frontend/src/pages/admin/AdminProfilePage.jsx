import { useState, useEffect, useRef } from "react";
import { AdminNavBar } from "../../components/AdminNavBar";
import { FormInput } from "../../components/ui/FormInput";
import { AdminTextarea } from "../../components/ui/AdminTextarea";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { ErrorPopup } from "../../components/ui/ErrorPopup";
import { profileService } from "../../services/profile.service.js";
import { TrashIcon } from "../../components/icons/TrashIcon";

export default function AdminProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

        setFormData({
          name: profile.name || "",
          username: profile.username || "",
          email: profile.email || "",
          bio: profile.bio || "",
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
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // สร้าง FormData สำหรับการส่งข้อมูลแบบ multipart/form-data
      const formDataToSend = new FormData();

      // เพิ่มข้อมูลทั้งหมดลงใน FormData
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("bio", formData.bio || "");

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
        bio: formData.bio,
        hasImageFile: !!imageFile,
        hasProfilePic: !!profilePic,
      });

      const response = await profileService.updateProfile(formDataToSend);
      console.log("Update response:", response);

      // อัปเดต profile picture จาก response
      if (response.profile?.profilePic) {
        setProfilePic(response.profile.profilePic);
        setImagePreview(response.profile.profilePic);
      }

      // Clear imageFile เพราะอัปโหลดเสร็จแล้ว
      setImageFile(null);

      // Show success modal
      setShowModal(true);

      // Auto hide modal after 5 seconds
      setTimeout(() => {
        setShowModal(false);
      }, 5000);
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error response:", error.response);
      setError(
        error.response?.data?.message ||
          `Failed to update profile: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar
        title="Profile"
        actionButton={{
          label: "Save",
          onClick: handleSubmit,
          showIcon: false,
          disabled: isLoading,
        }}
      />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        {/* Error Popup */}
        {error && <ErrorPopup message={error} onClose={() => setError(null)} />}

        {/* Loading State */}
        {isLoading && !formData.name ? (
          <div className="flex items-center justify-center py-8">
            <p className="font-poppins text-base font-medium text-brown-400">
              Loading profile...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-[28px]">
              <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full bg-brown-200">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-brown-400">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    title="Remove image"
                  >
                    <TrashIcon className="h-4 w-4" stroke="currentColor" />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  id="profile-upload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  disabled={isLoading}
                />
                <label
                  htmlFor="profile-upload"
                  className="h-12 cursor-pointer rounded-full border border-brown-400 bg-white px-10 py-3 font-poppins text-base font-medium leading-6 text-brown-600 transition-colors hover:bg-brown-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {imagePreview
                    ? "Change profile picture"
                    : "Upload profile picture"}
                </label>
              </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <FormInput
                id="name"
                name="name"
                type="text"
                label="Name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-[480px] [&_label]:mb-1 [&_label]:leading-6 [&_input]:font-medium [&_input]:leading-6 [&_input]:text-brown-500 [&_input]:py-3 [&_input]:pl-4 [&_input]:pr-3 [&_input]:px-0"
              />

              <FormInput
                id="username"
                name="username"
                type="text"
                label="Username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-[480px] [&_label]:mb-1 [&_label]:leading-6 [&_input]:font-medium [&_input]:leading-6 [&_input]:text-brown-500 [&_input]:py-3 [&_input]:pl-4 [&_input]:pr-3 [&_input]:px-0"
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
                className="w-[480px] [&_label]:mb-1 [&_label]:leading-6 [&_input]:font-medium [&_input]:leading-6 [&_input]:text-brown-500 [&_input]:py-3 [&_input]:pl-4 [&_input]:pr-3 [&_input]:px-0"
              />

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="bio"
                  className="font-poppins text-base font-medium leading-6 text-brown-400"
                >
                  Bio (max 120 letters)
                </label>
                <AdminTextarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  maxLength={120}
                  disabled={isLoading}
                />
              </div>
            </form>
          </>
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title="Saved profile"
        description="Your profile has been successfully updated"
      />
    </div>
  );
}
