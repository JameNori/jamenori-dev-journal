import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminNavBar } from "../../components/AdminNavBar";
import { ChevronDownIcon } from "../../components/icons/ChevronDownIcon";
import { SearchIcon } from "../../components/icons/SearchIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";

export default function ArticleManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  useEffect(() => {
    if (location.state?.showModal) {
      setModalTitle(location.state.modalTitle);
      setModalDescription(location.state.modalDescription);
      setShowModal(true);

      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
        setShowModal(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // หมายเหตุ:  ใช้ข้อมูล mock แทน
  const [articles, setArticles] = useState([
    {
      id: 1,
      title:
        "Understanding Cat Behavior: Why Your Feline Friend Acts the Way They D...",
      category: "Cat",
      status: "Published",
    },
    {
      id: 2,
      title: "The Art of Pet Care: Essential Tips for New Pet Owners",
      category: "General",
      status: "Published",
    },
    {
      id: 3,
      title: "10 Inspiring Stories of Animal Rescue",
      category: "Inspiration",
      status: "Published",
    },
  ]);

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete) {
      
      console.log("Delete article", articleToDelete.id);

      // Remove article from list
      setArticles((prev) =>
        prev.filter((article) => article.id !== articleToDelete.id)
      );
      setShowDeleteModal(false);
      setArticleToDelete(null);

      // Show success modal
      setModalTitle("Article deleted");
      setModalDescription("Your article has been successfully deleted");
      setShowModal(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar
        title="Article management"
        actionButton={{
          label: "Create article",
          onClick: () => navigate("/admin/article-management/create"),
        }}
      />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-[360px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400">
              <SearchIcon className="h-6 w-6" stroke="currentColor" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-lg border border-brown-300 bg-white pl-12 pr-4 font-poppins text-base text-brown-600 placeholder:text-brown-400 focus:border-brown-400 focus:outline-none"
            />
          </div>
          <div className="flex h-12 items-center gap-4">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 w-[200px] appearance-none rounded-lg border border-brown-300 bg-white py-3 pl-4 pr-10 font-poppins text-base font-medium leading-6 text-brown-400 focus:border-brown-400 focus:outline-none"
              >
                <option value="all">Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown-600">
                <ChevronDownIcon className="h-6 w-6" stroke="currentColor" />
              </div>
            </div>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-12 w-[200px] appearance-none rounded-lg border border-brown-300 bg-white py-3 pl-4 pr-10 font-poppins text-base font-medium leading-6 text-brown-400 focus:border-brown-400 focus:outline-none"
              >
                <option value="all">Category</option>
                <option value="cat">Cat</option>
                <option value="general">General</option>
                <option value="inspiration">Inspiration</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown-600">
                <ChevronDownIcon className="h-6 w-6" stroke="currentColor" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-brown-200 bg-white">
          <table className="w-full">
            <thead className="bg-brown-100 shadow-[0_2px_12px_0_rgba(0,0,0,0.1)]">
              <tr>
                <th className="px-6 py-3 text-left font-poppins text-base font-medium leading-6 text-brown-400">
                  Article title
                </th>
                <th className="w-[160px] px-6 py-3 text-left font-poppins text-base font-medium leading-6 text-brown-400">
                  Category
                </th>
                <th className="w-[160px] px-6 py-3 text-left font-poppins text-base font-medium leading-6 text-brown-400">
                  Status
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => (
                <tr
                  key={article.id}
                  className={`border-b border-brown-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-brown-200"
                  }`}
                >
                  <td className="px-6 py-4 font-poppins text-base font-medium leading-6 text-brown-500">
                    {article.title}
                  </td>
                  <td className="px-6 py-4 font-poppins text-base font-medium leading-6 text-brown-500">
                    {article.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green"></div>
                      <span className="font-poppins text-base font-medium leading-6 text-green">
                        {article.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/article-management/edit/${article.id}`
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
                        onClick={() => handleDeleteClick(article)}
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
        title="Delete article"
        message="Do you want to delete this article?"
        confirmButtonText="Delete"
      />
    </div>
  );
}
