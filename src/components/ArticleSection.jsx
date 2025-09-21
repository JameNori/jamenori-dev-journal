import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { BlogCard } from "./BlogCard";
import { blogPosts } from "../data/blogpost";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";


function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");

  const categories = [
    { name: "Highlight", isActive: true },
    { name: "Cat", isActive: false },
    { name: "Inspiration", isActive: false },
    { name: "General", isActive: false },
  ];
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Latest articles
        </h2>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:block bg-[#EFEEEB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            {/* Category Filters */}
            <div className="flex items-center gap-6">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.name
                      ? "bg-[#DAD6D1] text-[#43403B] cursor-not-allowed" // สีเมื่อถูกเลือก + disabled
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100" // สีเมื่อไม่ถูกเลือก + hover
                  }`}
                  disabled={selectedCategory === category.name} // ปิดการคลิกปุ่มที่ถูกเลือก
                  onClick={() => setSelectedCategory(category.name)} // เปลี่ยน state เมื่อคลิก
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder="Search" className="pr-10" />
            </div>
          </div>
        </div>

        {/* Mobile Layout - Vertical */}
        <div className="lg:hidden space-y-4 bg-[#EFEEEB] rounded-lg p-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input type="text" placeholder="Search" className="w-full pr-10" />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts
            .filter(
              (post) =>
                selectedCategory === "Highlight" ||
                post.category === selectedCategory
            )
            .slice(0, 6)
            .map((post) => (
              <BlogCard
                key={post.id}
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={post.date}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

export default ArticleSection;
