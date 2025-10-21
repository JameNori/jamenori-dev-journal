import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { BlogCard } from "./BlogCard";
import { useState, useEffect } from "react";
import axios from "axios";
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

  const categories = [
    { name: "Highlight", isActive: true },
    { name: "Cat", isActive: false },
    { name: "Inspiration", isActive: false },
    { name: "General", isActive: false },
  ];

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
      if (category && category !== "Highlight") {
        params.category = category;
      }

      const response = await axios.get(
        "https://blog-post-project-api.vercel.app/posts",
        {
          params,
        }
      );

      if (isLoadMore) {
        // รวมโพสต์ใหม่กับโพสต์เดิม
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      } else {
        // แทนที่โพสต์เดิม
        setPosts(response.data.posts);
      }

      // ตรวจสอบว่าได้ข้อมูลหน้าสุดท้ายแล้วหรือยัง
      if (response.data.currentPage >= response.data.totalPages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

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

            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-brown-400" />
              <Input
                type="text"
                placeholder="Search"
                className="pr-10 font-poppins text-base font-medium leading-6 text-brown-500 placeholder:text-brown-400"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - Vertical */}
        <div className="space-y-4 rounded-2xl px-6 py-4 bg-brown-200 lg:hidden">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-brown-400" />
            <Input
              type="text"
              placeholder="Search"
              className="w-full pr-10 font-poppins text-base font-medium leading-6 text-brown-500 placeholder:text-brown-400"
            />
          </div>

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
