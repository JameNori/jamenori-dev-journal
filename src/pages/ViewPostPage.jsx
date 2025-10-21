import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { formatDate } from "../lib/utils";

export default function ViewPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // ใช้ API เดียวกันแต่หา post โดย ID
        const response = await axios.get(
          "https://blog-post-project-api.vercel.app/posts"
        );
        const foundPost = response.data.posts.find(
          (p) => p.id === parseInt(postId)
        );

        if (foundPost) {
          setPost(foundPost);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-poppins text-brown-500">Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-poppins text-red-500">{error || "Post not found"}</p>
      </div>
    );
  }

  const formattedDate = post.date.includes("T")
    ? formatDate(post.date)
    : post.date;

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-8 lg:px-[120px]">
        {/* Post Image */}
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-2xl"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <span className="rounded-full bg-green-light px-3 py-1 font-poppins text-sm font-medium text-green">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-poppins text-4xl font-bold text-brown-600 mb-4 lg:text-5xl lg:mb-6">
          {post.title}
        </h1>

        {/* Description */}
        <p className="font-poppins text-lg text-brown-400 mb-8 leading-relaxed">
          {post.description}
        </p>

        {/* Author Info */}
        <div className="flex items-center mb-12">
          <img
            src={post.image}
            alt={post.author}
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <div>
            <p className="font-poppins font-medium text-brown-600">
              {post.author}
            </p>
            <p className="font-poppins text-brown-400">{formattedDate}</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="markdown">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
