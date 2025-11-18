import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  const handleSearch = async (keyword) => {
    if (keyword.trim()) {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-post-project-api.vercel.app/posts",
          {
            params: {
              keyword: keyword,
              limit: 6,
            },
          }
        );
        setResults(response.data.posts);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query]);

  // ปิดผลการค้นหาเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-80" ref={searchRef}>
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-brown-400" />
      <Input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10 font-poppins text-base font-medium leading-6 text-brown-500 placeholder:text-brown-400"
      />

      {/* Search Results Dropdown */}
      {showResults && query.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-brown-300 bg-white shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="px-6 py-4 text-center">
              <p className="font-poppins text-brown-500">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="block px-6 py-4 hover:bg-brown-100 border-b border-brown-100 last:border-b-0 transition-colors"
                onClick={() => {
                  setShowResults(false);
                  setQuery("");
                }}
              >
                <h3 className="font-poppins text-base font-medium text-brown-600 line-clamp-1 mb-1">
                  {post.title}
                </h3>
                <p className="font-poppins text-sm text-brown-400 line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))
          ) : (
            <div className="px-6 py-4 text-center">
              <p className="font-poppins text-brown-500">No posts found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
