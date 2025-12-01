import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavBar } from "../../components/AdminNavBar";
import { ChevronDownIcon } from "../../components/icons/ChevronDownIcon";
import { ImageBoxIcon } from "../../components/icons/ImageBoxIcon";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { AdminInput } from "../../components/ui/AdminInput";
import { AdminTextarea } from "../../components/ui/AdminTextarea";
import { ErrorPopup } from "../../components/ui/ErrorPopup";
import { postService } from "../../services/post.service.js";

export default function CreateArticlePage() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const isEditMode = !!articleId;

  // หมายเหตุ: ตอนนี้ยังไม่ได้ใช้ข้อมูลที่มาจากฝั่ง backend
  const mockArticles = {
    1: {
      thumbnail: null,
      category_id: 1, // Cat
      authorName: "Thompson P.",
      title:
        "Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do",
      introduction:
        "Cats have captivated human hearts for thousands of years. Whether lounging in a sunny spot or playfully chasing a string, these furry companions bring warmth and joy to millions of homes.",
      content:
        "1. Independent Yet Affectionate\n\nCats are known for their independent nature, but they also form deep bonds with their owners. This unique combination makes them fascinating companions.\n\n2. Playful Personalities\n\nEach cat has its own personality, from the playful kitten to the wise senior cat. Understanding your cat's individual traits helps build a stronger relationship.\n\n3. Communication Through Body Language\n\nCats communicate through various body signals. Learning to read these signs helps you understand your cat's needs and emotions.",
    },
    2: {
      thumbnail: null,
      category_id: 2, // Inspiration
      authorName: "Thompson P.",
      title: "10 Inspiring Stories of Animal Rescue",
      introduction:
        "Animal rescue stories inspire hope and demonstrate the incredible bond between humans and animals. These tales of compassion and resilience remind us of the power of kindness.",
      content:
        "1. The Story of Hope\n\nHope was found abandoned in a parking lot, malnourished and scared. Through the dedication of rescue workers and a loving foster family, Hope transformed into a healthy, happy cat.\n\n2. A Second Chance\n\nMany animals face difficult circumstances, but with the right care and love, they can overcome incredible odds. These stories show that every animal deserves a chance at a better life.\n\n3. The Power of Community\n\nAnimal rescue often involves entire communities coming together to help animals in need. These collective efforts make a significant difference in the lives of countless animals.",
    },
    3: {
      thumbnail: null,
      category_id: 3, // General
      authorName: "Thompson P.",
      title: "The Art of Pet Care: Essential Tips for New Pet Owners",
      introduction:
        "Pet care is an essential part of being a responsible pet owner. Whether you have a cat, dog, or other companion, understanding their needs is crucial for their well-being.",
      content:
        "Taking care of a pet requires dedication, knowledge, and love. This guide covers the essential aspects of pet care, from nutrition to exercise and everything in between.\n\n1. Nutrition\n\nProviding proper nutrition is fundamental to your pet's health. Choose high-quality food that meets your pet's specific dietary needs.\n\n2. Exercise\n\nRegular exercise keeps pets healthy and happy. The amount and type of exercise depend on your pet's species, breed, and age.\n\n3. Veterinary Care\n\nRegular check-ups and vaccinations are essential for preventing diseases and ensuring your pet's long-term health.",
    },
  };

  const [formData, setFormData] = useState({
    thumbnail: null,
    category_id: "",
    authorName: "Thompson P.",
    title: "",
    introduction: "",
    content: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Load article data when in edit mode
  useEffect(() => {
    if (isEditMode && articleId) {
      // หมายเหตุ: ตอนนี้ยังไม่ได้ใช้ข้อมูลที่มาจากฝั่ง backend
      const article = mockArticles[articleId];
      if (article) {
        setFormData(article);
        // ถ้ามี thumbnail URL ให้แสดง preview
        if (article.thumbnail) {
          setImagePreview(article.thumbnail);
        }
      }
    }
  }, [articleId, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  // ฟังก์ชันสำหรับบันทึกข้อมูลโพสต์
  const handleSave = async (statusId) => {
    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.category_id) {
      setError("Category is required");
      return;
    }
    if (!formData.introduction.trim()) {
      setError("Introduction is required");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    // ถ้าเป็น create mode ต้องมีรูปภาพ
    if (!isEditMode && !imageFile) {
      setError("Please select an image file.");
      return;
    }

    // ถ้าเป็น edit mode แต่ไม่มีรูปภาพใหม่และไม่มีรูปภาพเดิม → error
    if (isEditMode && !imageFile && !formData.thumbnail) {
      setError("Please select an image file or keep the existing image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // สร้าง FormData สำหรับการส่งข้อมูลแบบ multipart/form-data
      const formDataToSend = new FormData();

      // เพิ่มข้อมูลทั้งหมดลงใน FormData
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category_id", formData.category_id.toString());
      formDataToSend.append("description", formData.introduction);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("status_id", statusId.toString());

      // จัดการรูปภาพ
      if (imageFile) {
        // ถ้ามีไฟล์ใหม่ → ส่งไฟล์
        formDataToSend.append("imageFile", imageFile);
      } else if (formData.thumbnail) {
        // ถ้าไม่มีไฟล์ใหม่ แต่มี URL เดิม (edit mode) → ส่ง URL
        formDataToSend.append("image", formData.thumbnail);
      }

      // ส่งข้อมูลไปยัง Backend
      if (isEditMode) {
        await postService.updatePost(articleId, formDataToSend);
      } else {
        await postService.createPost(formDataToSend);
      }

      // Navigate with state to show modal on ArticleManagementPage
      const statusText = statusId === 1 ? "draft" : "published";
      navigate("/admin/article-management", {
        state: {
          showModal: true,
          modalTitle: isEditMode
            ? `Article updated and saved as ${statusText}`
            : `Create article and saved as ${statusText}`,
          modalDescription:
            statusId === 1
              ? "You can publish article later"
              : "Your article has been successfully published",
        },
      });
    } catch (error) {
      console.error("Error saving post:", error);
      setError(
        error.response?.data?.message ||
          "Failed to save post. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    handleSave(1); // status_id = 1 (draft)
  };

  const handleSaveAndPublish = () => {
    handleSave(2); // status_id = 2 (publish)
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await postService.deletePost(articleId);

      // Navigate with state to show modal on ArticleManagementPage
      navigate("/admin/article-management", {
        state: {
          showModal: true,
          modalTitle: "Article deleted",
          modalDescription: "Your article has been successfully deleted",
        },
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete post. Please try again."
      );
      setShowDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar
        title={isEditMode ? "Edit article" : "Create article"}
        actionButtons={[
          {
            label: isEditMode ? "Save as draft" : "Save as draft",
            onClick: handleSaveDraft,
            variant: "secondary",
            disabled: isLoading,
          },
          {
            label: isEditMode ? "Save" : "Save and publish",
            onClick: handleSaveAndPublish,
            variant: "primary",
            disabled: isLoading,
          },
        ]}
      />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        {/* Thumbnail image section */}
        <div className="mb-6">
          <label className="mb-2 block font-poppins text-base font-medium leading-6 text-brown-400">
            Thumbnail image
          </label>
          <div className="flex gap-4">
            <div className="relative flex h-[260px] w-[460px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-brown-300 bg-brown-200 py-3 px-4">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    title="Remove image"
                  >
                    <TrashIcon className="h-4 w-4" stroke="currentColor" />
                  </button>
                </>
              ) : (
                <div className="text-brown-400">
                  <ImageBoxIcon
                    className="h-10 w-10"
                    stroke="currentColor"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
            <div className="flex items-end">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="h-12 cursor-pointer rounded-full border border-brown-400 bg-white px-10 py-3 font-poppins text-base font-medium leading-6 text-brown-600 transition-colors hover:bg-brown-100"
              >
                {imagePreview
                  ? "Change thumbnail image"
                  : "Upload thumbnail image"}
              </label>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6 w-[480px]">
          <label className="mb-1 block font-poppins text-base font-medium leading-6 text-brown-400">
            Category
          </label>
          <div className="relative">
            <select
              value={formData.category_id}
              onChange={(e) => handleInputChange("category_id", e.target.value)}
              className="h-12 w-full appearance-none rounded-lg border border-brown-300 bg-white py-3 pl-4 pr-3 font-poppins text-base font-medium leading-6 text-brown-500 focus:border-brown-400 focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="1">Cat</option>
              <option value="2">Inspiration</option>
              <option value="3">General</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown-600">
              <ChevronDownIcon className="h-6 w-6" stroke="currentColor" />
            </div>
          </div>
        </div>

        {/* Author name */}
        <div className="mb-6 w-[480px]">
          <label className="mb-1 block font-poppins text-base font-medium leading-6 text-brown-400">
            Author name
          </label>
          <AdminInput type="text" value={formData.authorName} readOnly />
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="mb-1 block font-poppins text-base font-medium leading-6 text-brown-400">
            Title
          </label>
          <AdminInput
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Article title"
          />
        </div>

        {/* Introduction */}
        <div className="mb-6">
          <label className="mb-1 block font-poppins text-base font-medium leading-6 text-brown-400">
            Introduction (max 120 letters)
          </label>
          <AdminTextarea
            value={formData.introduction}
            onChange={(e) => handleInputChange("introduction", e.target.value)}
            placeholder="Introduction"
            maxLength={120}
            rows={4}
            className="h-[143px]"
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="mb-1 block font-poppins text-base font-medium leading-6 text-brown-400">
            Content
          </label>
          <AdminTextarea
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Content"
            className="h-[572px]"
          />
        </div>

        {/* Delete article button - only show in edit mode */}
        {isEditMode && (
          <div className="mt-6">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 font-poppins text-base font-medium leading-6 text-brown-600 underline transition-colors hover:text-brown-400"
            >
              <TrashIcon className="h-6 w-6" stroke="currentColor" />
              Delete article
            </button>
          </div>
        )}
      </div>

      {/* Error Popup */}
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete article"
        message="Do you want to delete this article?"
        confirmButtonText="Delete"
      />
    </div>
  );
}
