import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavBar } from "../../components/AdminNavBar";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { AdminInput } from "../../components/ui/AdminInput";

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const isEditMode = !!categoryId;

  // หมายเหตุ:  ใช้ข้อมูล mock แทน
  const mockCategories = {
    1: { name: "Cat" },
    2: { name: "General" },
    3: { name: "Inspiration" },
  };

  const [formData, setFormData] = useState({
    name: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load category data when in edit mode
  useEffect(() => {
    if (isEditMode && categoryId) {
      // หมายเหตุ:  ใช้ข้อมูล mock แทน
      const category = mockCategories[categoryId];
      if (category) {
        setFormData(category);
      }
    }
  }, [categoryId, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    
    console.log(isEditMode ? "Update category" : "Create category", formData);

    // Navigate with state to show modal on CategoryManagementPage
    navigate("/admin/category-management", {
      state: {
        showModal: true,
        modalTitle: isEditMode ? "Update category" : "Create category",
        modalDescription: isEditMode
          ? "Category has been successfully updated."
          : "Category has been successfully created.",
      },
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    
    console.log("Delete category", categoryId);

    // Navigate with state to show modal on CategoryManagementPage
    navigate("/admin/category-management", {
      state: {
        showModal: true,
        modalTitle: "Category deleted",
        modalDescription: "Category has been successfully deleted.",
      },
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar
        title={isEditMode ? "Edit category" : "Create category"}
        actionButton={{
          label: "Save",
          onClick: handleSave,
          showIcon: false,
        }}
      />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        {/* Category name */}
        <div className="mb-6 w-[480px]">
          <label className="mb-1 block font-poppins text-base font-medium leading-6 text-brown-400">
            Category name
          </label>
          <AdminInput
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Category name"
          />
        </div>

        {/* Delete category button - only show in edit mode */}
        {isEditMode && (
          <div className="mt-6">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 font-poppins text-base font-medium leading-6 text-brown-600 underline transition-colors hover:text-brown-400"
            >
              <TrashIcon className="h-6 w-6" stroke="currentColor" />
              Delete category
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete category"
        message="Do you want to delete this category?"
        confirmButtonText="Delete"
      />
    </div>
  );
}
