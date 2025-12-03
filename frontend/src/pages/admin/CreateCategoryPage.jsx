import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminNavBar } from "../../components/AdminNavBar";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { AdminInput } from "../../components/ui/AdminInput";
import { ErrorPopup } from "../../components/ui/ErrorPopup";
import { categoryService } from "../../services/category.service.js";

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const isEditMode = !!categoryId;

  const [formData, setFormData] = useState({
    name: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load category data when in edit mode
  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditMode && categoryId) {
        setIsLoading(true);
        setError(null);

        try {
          console.log("Fetching category with ID:", categoryId);
          const category = await categoryService.getCategoryById(categoryId);
          console.log("Category data:", category);

          setFormData({
            name: category.name || "",
          });
        } catch (error) {
          console.error("Error fetching category:", error);
          console.error("Error response:", error.response);
          setError(
            error.response?.data?.message ||
              "Failed to fetch category. Please try again."
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategory();
  }, [categoryId, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name || formData.name.trim() === "") {
      setError("Category name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        console.log("Updating category:", categoryId, formData);
        const response = await categoryService.updateCategory(
          categoryId,
          formData
        );
        console.log("Update response:", response);

        // Navigate with state to show modal on CategoryManagementPage
        navigate("/admin/category-management", {
          state: {
            showModal: true,
            modalTitle: "Update category",
            modalDescription: "Category has been successfully updated.",
          },
        });
      } else {
        console.log("Creating category:", formData);
        const response = await categoryService.createCategory(formData);
        console.log("Create response:", response);

        // Navigate with state to show modal on CategoryManagementPage
        navigate("/admin/category-management", {
          state: {
            showModal: true,
            modalTitle: "Create category",
            modalDescription: "Category has been successfully created.",
          },
        });
      }
    } catch (error) {
      console.error("Error saving category:", error);
      console.error("Error response:", error.response);
      setError(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} category: ${
            error.message || "Unknown error"
          }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Deleting category:", categoryId);
      const response = await categoryService.deleteCategory(categoryId);
      console.log("Delete response:", response);

      // Navigate with state to show modal on CategoryManagementPage
      navigate("/admin/category-management", {
        state: {
          showModal: true,
          modalTitle: "Category deleted",
          modalDescription: "Category has been successfully deleted.",
        },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      console.error("Error response:", error.response);
      setError(
        error.response?.data?.message ||
          `Failed to delete category: ${error.message || "Unknown error"}`
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
        title={isEditMode ? "Edit category" : "Create category"}
        actionButton={{
          label: "Save",
          onClick: handleSave,
          showIcon: false,
          disabled: isLoading,
        }}
      />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        {/* Error Popup */}
        {error && <ErrorPopup message={error} onClose={() => setError(null)} />}

        {/* Loading State */}
        {isLoading && isEditMode && formData.name === "" ? (
          <div className="flex items-center justify-center py-8">
            <p className="font-poppins text-base font-medium text-brown-400">
              Loading category...
            </p>
          </div>
        ) : (
          <>
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
                disabled={isLoading}
              />
            </div>

            {/* Delete category button - only show in edit mode */}
            {isEditMode && (
              <div className="mt-6">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 font-poppins text-base font-medium leading-6 text-brown-600 underline transition-colors hover:text-brown-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <TrashIcon className="h-6 w-6" stroke="currentColor" />
                  Delete category
                </button>
              </div>
            )}
          </>
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
