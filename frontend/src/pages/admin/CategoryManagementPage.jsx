import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminNavBar } from "../../components/AdminNavBar";
import { SearchIcon } from "../../components/icons/SearchIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";

export default function CategoryManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Check for modal state from navigation
  useEffect(() => {
    if (location.state?.showModal) {
      setModalTitle(location.state.modalTitle);
      setModalDescription(location.state.modalDescription);
      setShowModal(true);

      // Clear location state to prevent showing modal on refresh
      window.history.replaceState({}, document.title);

      // Auto hide modal after 5 seconds
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // หมายเหตุ:  ใช้ข้อมูล mock แทน
  const [categories, setCategories] = useState([
    { id: 1, name: "Cat" },
    { id: 2, name: "General" },
    { id: 3, name: "Inspiration" },
  ]);

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      
      console.log("Delete category", categoryToDelete.id);

      // Remove category from list
      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryToDelete.id)
      );
      setShowDeleteModal(false);
      setCategoryToDelete(null);

      // Show success modal
      setModalTitle("Category deleted");
      setModalDescription("Your category has been successfully deleted");
      setShowModal(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar
        title="Category management"
        actionButton={{
          label: "Create category",
          onClick: () => navigate("/admin/category-management/create"),
        }}
      />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        <div className="mb-6">
          <div className="relative w-[360px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400">
              <SearchIcon className="h-6 w-6" stroke="currentColor" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-lg border border-brown-300 bg-white pl-12 pr-4 font-poppins text-base font-medium leading-6 text-brown-600 placeholder:text-brown-400 focus:border-brown-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-brown-200 bg-white">
          <table className="w-full">
            <thead className="bg-brown-100 shadow-[0_2px_12px_0_rgba(0,0,0,0.1)]">
              <tr>
                <th className="px-6 py-3 text-left font-poppins text-base font-medium leading-6 text-brown-400">
                  Category
                </th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className={`border-b border-brown-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-brown-200"
                  }`}
                >
                  <td className="px-6 py-4 font-poppins text-base font-medium leading-6 text-brown-500">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/category-management/edit/${category.id}`
                          )
                        }
                        className="text-brown-400 transition-colors hover:text-brown-600"
                      >
                        <EditIcon
                          className="h-6 w-6"
                          stroke="currentColor"
                          fill="currentColor"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="text-brown-400 transition-colors hover:text-brown-600"
                      >
                        <TrashIcon className="h-6 w-6" stroke="currentColor" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        description={modalDescription}
      />

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
