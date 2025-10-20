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
                      ? "cursor-not-allowed bg-brown-300 text-brown-500" // สีเมื่อถูกเลือก + disabled
                      : "cursor-pointer text-brown-400 hover:bg-brown-100 hover:text-brown-600" // สีเมื่อไม่ถูกเลือก + hover
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
              onValueChange={(value) => setSelectedCategory(value)}
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

        {/* Blog Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
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
