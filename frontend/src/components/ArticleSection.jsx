import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { BlogCard } from "./BlogCard";
import { SearchBar } from "./SearchBar";
import { MobileSearchBar } from "./MobileSearchBar";
import { useState, useEffect } from "react";
import { postService } from "../services/post.service.js";
import { profileService } from "../services/profile.service.js";
import { categoryService } from "../services/category.service.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [adminProfilePic, setAdminProfilePic] = useState(null);
  const [categories, setCategories] = useState([
    { name: "Highlight" }, // เริ่มต้นด้วย Highlight
  ]);

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  const fetchPosts = async (
    category = null,
    pageNum = 1,
    isLoadMore = false
  ) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setPosts([]); // เคลียร์ posts เมื่อโหลดใหม่ (เปลี่ยน category)
      }

      setError(null);

      const params = {
        limit: 6,
        page: pageNum,
      };

      // เพิ่ม category parameter ถ้าไม่ใช่ "Highlight"
      // แปลง category name เป็น category_id โดยใช้ categories ที่ดึงมาจาก API
      if (category && category !== "Highlight") {
        const matchedCategory = categories.find((cat) => cat.name === category);
        if (matchedCategory && matchedCategory.id) {
          params.category = matchedCategory.id;
        }
      }

      console.log("Fetching posts with params:", params);
      const response = await postService.getAllPosts(params);
      console.log("Posts response:", response);

      // แปลงข้อมูลจาก backend format เป็น frontend format
      const formattedPosts = response.posts.map((post) => ({
        id: post.id,
        image: post.image,
        category: post.category || "General",
        title: post.title,
        description: post.description,
        author: post.author || "Author", // ถ้า backend ไม่มี author ให้ใช้ default
        date: post.date,
      }));

      if (isLoadMore) {
        // รวมโพสต์ใหม่กับโพสต์เดิม
        setPosts((prevPosts) => [...prevPosts, ...formattedPosts]);
      } else {
        // แทนที่โพสต์เดิม
        setPosts(formattedPosts);
      }

      // ตรวจสอบว่าได้ข้อมูลหน้าสุดท้ายแล้วหรือยัง
      if (response.currentPage >= response.totalPages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      console.error("Error response:", err.response);
      setError(
        err.response?.data?.message ||
          "Failed to fetch posts. Please try again."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ดึงข้อมูล categories เมื่อ component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories("");
        console.log("Categories response:", response);
        // เพิ่ม "Highlight" เข้าไปเป็นตัวแรก แล้วตามด้วย categories จาก API
        const apiCategories = response.categories || [];
        setCategories([
          { name: "Highlight" }, // Highlight แสดงทุก category
          ...apiCategories,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // ถ้า error ให้ใช้แค่ Highlight
        setCategories([{ name: "Highlight" }]);
      }
    };

    fetchCategories();
  }, []);

  // ดึงข้อมูล admin profile เมื่อ component mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const profile = await profileService.getAdminProfile();
        setAdminProfilePic(profile.profilePic || null);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        // ใช้ null ถ้า error
      }
    };

    fetchAdminProfile();
  }, []);

  // ดึงข้อมูลเมื่อ component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // ดึงข้อมูลใหม่เมื่อเปลี่ยน category
  useEffect(() => {
    setPage(1); // รีเซ็ตหน้าเป็น 1
    setHasMore(true); // รีเซ็ต hasMore
    fetchPosts(selectedCategory, 1);
  }, [selectedCategory]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(selectedCategory, nextPage, true); // true = isLoadMore
  };

  return (
    <section className="py-12 bg-brown-100">
      <div className="mx-auto px-4 lg:max-w-8xl lg:px-[120px]">
        {/* Title */}
        <h2 className="mb-8 font-poppins text-2xl font-semibold leading-8 text-brown-600 lg:mb-12">
          Latest articles
        </h2>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden rounded-2xl px-6 py-4 bg-brown-200 lg:block">
          <div className="flex items-center justify-between">
            {/* Category Filters */}
            <div className="flex items-center gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`rounded-lg px-5 py-3 font-poppins text-base font-medium leading-6 transition-colors ${
                    selectedCategory === category.name
                      ? "cursor-not-allowed bg-brown-300 text-brown-500"
                      : "cursor-pointer text-brown-400 hover:bg-brown-100 hover:text-brown-600"
                  }`}
                  disabled={selectedCategory === category.name}
                  onClick={() => handleCategoryChange(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search Bar - ใช้ SearchBar component ใหม่ */}
            <SearchBar />
          </div>
        </div>

        {/* Mobile Layout - Vertical */}
        <div className="space-y-4 rounded-2xl px-6 py-4 bg-brown-200 lg:hidden">
          {/* Search Bar - ใช้ MobileSearchBar component ใหม่ */}
          <MobileSearchBar />

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => handleCategoryChange(value)}
            >
              <SelectTrigger className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-poppins text-base font-medium leading-6 text-brown-400 focus:ring-2 focus:ring-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-brown-300 bg-white">
                {categories.map((category, index) => (
                  <SelectItem
                    key={index}
                    value={category.name}
                    className="font-poppins text-base font-medium leading-6 text-brown-400 hover:bg-brown-100 focus:bg-brown-100"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-12 text-center">
            <p className="font-poppins text-brown-500">Loading posts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-12 text-center">
            <p className="font-poppins text-red-500">{error}</p>
          </div>
        )}

        {/* Blog Cards Grid */}
        {!loading && !error && posts.length > 0 && (
          <>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  image={post.image}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  author={post.author}
                  date={post.date}
                  authorProfilePic={adminProfilePic}
                />
              ))}
            </div>

            {/* View More Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="font-poppins text-base font-medium leading-6 text-brown-600 underline transition-colors hover:text-brown-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
                >
                  {loadingMore ? "Loading..." : "View more"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="mt-12 text-center">
            <p className="font-poppins text-brown-500">No posts found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ArticleSection;
