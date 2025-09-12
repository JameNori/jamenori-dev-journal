import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { BlogCard } from "./BlogCard";
import { blogPosts } from "../data/blogpost";

function ArticleSection() {
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
              <button className="bg-[#DAD6D1] text-[#43403B] px-4 py-2 rounded-lg font-medium hover:bg-[#75716B] hover:text-white transition-colors">
                Highlight
              </button>
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                Cat
              </button>
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                Inspiration
              </button>
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                General
              </button>
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
            <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent">
              <option value="highlight">Highlight</option>
              <option value="cat">Cat</option>
              <option value="inspiration">Inspiration</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <BlogCard
            image={blogPosts[0].image}
            category={blogPosts[0].category}
            title={blogPosts[0].title}
            description={blogPosts[0].description}
            author={blogPosts[0].author}
            date={blogPosts[0].date}
          />
          <BlogCard
            image={blogPosts[1].image}
            category={blogPosts[1].category}
            title={blogPosts[1].title}
            description={blogPosts[1].description}
            author={blogPosts[1].author}
            date={blogPosts[1].date}
          />
          <BlogCard
            image={blogPosts[2].image}
            category={blogPosts[2].category}
            title={blogPosts[2].title}
            description={blogPosts[2].description}
            author={blogPosts[2].author}
            date={blogPosts[2].date}
          />
          <BlogCard
            image={blogPosts[3].image}
            category={blogPosts[3].category}
            title={blogPosts[3].title}
            description={blogPosts[3].description}
            author={blogPosts[3].author}
            date={blogPosts[3].date}
          />
          <BlogCard
            image={blogPosts[4].image}
            category={blogPosts[4].category}
            title={blogPosts[4].title}
            description={blogPosts[4].description}
            author={blogPosts[4].author}
            date={blogPosts[4].date}
          />
          <BlogCard
            image={blogPosts[5].image}
            category={blogPosts[5].category}
            title={blogPosts[5].title}
            description={blogPosts[5].description}
            author={blogPosts[5].author}
            date={blogPosts[5].date}
          />
        </div>
      </div>
    </section>
  );
}

export default ArticleSection;
