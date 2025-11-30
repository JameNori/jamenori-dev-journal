import { useState } from "react";
import { AdminNavBar } from "../../components/AdminNavBar";
import { FormInput } from "../../components/ui/FormInput";
import { AdminTextarea } from "../../components/ui/AdminTextarea";
import { SuccessModal } from "../../components/ui/SuccessModal";

export default function AdminProfilePage() {
  const [formData, setFormData] = useState({
    name: "Thompson P.",
    username: "thompson",
    email: "thompson.p@gmail.com",
    bio: "pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.",
  });

  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Profile saved:", formData);

    // Show success modal
    setShowModal(true);

    // Auto hide modal after 5 seconds
    setTimeout(() => {
      setShowModal(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar
        title="Profile"
        actionButton={{
          label: "Save",
          onClick: handleSubmit,
          showIcon: false,
        }}
      />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        <div className="mb-8 flex items-center gap-[28px]">
          <div className="h-[120px] w-[120px] overflow-hidden rounded-full bg-brown-200">
            <img
              src="https://via.placeholder.com/128"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <button className="h-12 rounded-full border border-brown-400 bg-white px-10 py-3 font-poppins text-base font-medium leading-6 text-brown-600 transition-colors hover:bg-brown-100">
            Upload profile picture
          </button>
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
            />
          </div>
        </form>
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
