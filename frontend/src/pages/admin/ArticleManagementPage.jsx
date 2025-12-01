import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminNavBar } from "../../components/AdminNavBar";
import { ChevronDownIcon } from "../../components/icons/ChevronDownIcon";
import { SearchIcon } from "../../components/icons/SearchIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { ErrorPopup } from "../../components/ui/ErrorPopup";
import { postService } from "../../services/post.service.js";

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
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Check for modal state from navigation
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

  // ดึงข้อมูล articles จาก backend
  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: 1,
        limit: 100, // ดึงทั้งหมดก่อน (หรือใช้ pagination ถ้าต้องการ)
      };

      // เพิ่ม keyword ถ้ามี search query
      if (searchQuery.trim()) {
        params.keyword = searchQuery.trim();
      }

      // เพิ่ม category filter
      if (categoryFilter !== "all") {
        // แปลง category name เป็น category_id
        const categoryMap = {
          cat: 1,
          inspiration: 2,
          general: 3,
        };
        params.category = categoryMap[categoryFilter];
      }

      console.log("Fetching articles with params:", params);
      const response = await postService.getAllPosts(params);
      console.log("Articles response:", response);

      // แปลงข้อมูลจาก backend format เป็น frontend format
      const formattedArticles = response.posts.map((post) => {
        // แปลง status_id เป็น status text
        const statusMap = {
          1: "Draft",
          2: "Published",
        };

        // ตรวจสอบว่า backend return category name หรือ category_id
        // จากที่ดู backend service, getAllPosts ไม่ return category name
        // แต่ return category_id ดังนั้นต้อง map เอง
        const categoryMap = {
          1: "Cat",
          2: "Inspiration",
          3: "General",
        };

        return {
          id: post.id,
          title: post.title,
          category: categoryMap[post.category_id] || "Unknown",
          status: statusMap[post.status_id] || "Unknown",
        };
      });

      // Filter by status (ถ้า backend ไม่รองรับ status filter)
      // หมายเหตุ: Backend ไม่มี status filter parameter ดังนั้นต้อง filter ที่ frontend
      let filteredArticles = formattedArticles;
      if (statusFilter !== "all") {
        const statusMap = {
          draft: "Draft",
          published: "Published",
        };
        filteredArticles = formattedArticles.filter(
          (article) => article.status === statusMap[statusFilter]
        );
      }

      console.log("Filtered articles:", filteredArticles);
      setArticles(filteredArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      console.error("Error response:", error.response);
      setError(
        error.response?.data?.message ||
          "Failed to fetch articles. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // เรียก fetchArticles เมื่อ component mount และเมื่อ filter เปลี่ยน
  // ใช้ debounce สำหรับ search query เพื่อลดการเรียก API
  useEffect(() => {
    // Clear timeout ถ้ามี
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // ถ้าเป็น search query ให้ใช้ debounce (รอ 500ms)
    if (searchQuery.trim() !== "") {
      searchTimeoutRef.current = setTimeout(() => {
        fetchArticles();
      }, 500);
    } else {
      // ถ้าไม่มี search query ให้เรียกทันที (สำหรับ status และ category filter)
      fetchArticles();
    }

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, categoryFilter]);

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (articleToDelete) {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Deleting article with ID:", articleToDelete.id);
        const response = await postService.deletePost(articleToDelete.id);
        console.log("Delete response:", response);

        // Refresh articles list
        await fetchArticles();

        setShowDeleteModal(false);
        setArticleToDelete(null);

        // Show success modal
        setModalTitle("Article deleted");
        setModalDescription("Your article has been successfully deleted");
        setShowModal(true);
      } catch (error) {
        console.error("Error deleting article:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);
        setError(
          error.response?.data?.message ||
            `Failed to delete article: ${error.message || "Unknown error"}`
        );
        setShowDeleteModal(false);
      } finally {
        setIsLoading(false);
      }
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

        {isLoading ? (
          <div className="py-10 text-center">
            <p className="font-poppins text-base text-brown-400">Loading...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-poppins text-base text-brown-400">
              No articles found
            </p>
          </div>
        ) : (
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
                        <div
                          className={`h-2 w-2 rounded-full ${
                            article.status === "Published"
                              ? "bg-green"
                              : "bg-brown-400"
                          }`}
                        ></div>
                        <span
                          className={`font-poppins text-base font-medium leading-6 ${
                            article.status === "Published"
                              ? "text-green"
                              : "text-brown-400"
                          }`}
                        >
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
                          <TrashIcon
                            className="h-6 w-6"
                            stroke="currentColor"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Error Popup */}
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}

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
