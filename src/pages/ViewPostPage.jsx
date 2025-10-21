import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { toast } from "sonner";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { formatDate } from "../lib/utils";

export default function ViewPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States สำหรับ Requirement #2
  const [isLoggedIn] = useState(false); // Mock: always false สำหรับ assignment
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

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
          setLikes(foundPost.likes || 0);
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

  // Functions สำหรับ Requirement #2
  const handleLike = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setLikes((prev) => prev + 1);
  };

  const handleComment = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    console.log("Comment submitted:", comment);
    setComment("");
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast.success("Copied!", {
        description: "This article has been copied to your clipboard.",
      });
    });
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const shareUrls = {
      facebook: `https://www.facebook.com/share.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      twitter: `https://www.twitter.com/share?&url=${url}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank");
    }
  };

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

        {/* Category & Date */}
        <div className="flex items-center justify-between mb-6">
          <span className="rounded-full bg-green-light px-3 py-1 font-poppins text-sm font-medium text-green">
            {post.category}
          </span>
          <span className="font-poppins text-sm text-brown-400">
            {formattedDate}
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
            <p className="font-poppins text-sm text-brown-400">
              I am a pet enthusiast and freelance writer who specializes in
              animal behavior and care.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="markdown">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>

        {/* Engagement Section - Like, Copy, Share */}
        <div className="flex items-center gap-4 mb-8 border-b border-brown-200 pb-8">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brown-300 hover:bg-brown-100 transition-colors"
          >
            👍{" "}
            <span className="font-poppins text-sm font-medium text-brown-600">
              {likes}
            </span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brown-300 hover:bg-brown-100 transition-colors"
          >
            {" "}
            <span className="font-poppins text-sm font-medium text-brown-600">
              Copy
            </span>
          </button>

          {/* Social Media Share Buttons */}
          <button
            onClick={() => handleSocialShare("facebook")}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
          >
            <span className="font-bold text-sm">f</span>
          </button>

          <button
            onClick={() => handleSocialShare("linkedin")}
            className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
          >
            <span className="font-bold text-xs">in</span>
          </button>

          <button
            onClick={() => handleSocialShare("twitter")}
            className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
          >
            
          </button>
        </div>

        {/* Comment Section */}
        <div className="mb-12">
          <h3 className="font-poppins text-2xl font-semibold text-brown-600 mb-6">
            Comment
          </h3>

          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full h-32 p-4 border border-brown-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brown-200"
              onClick={handleComment}
            />
            <button
              onClick={handleComment}
              className="absolute bottom-4 right-4 px-6 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors font-poppins font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-brown-400 hover:text-brown-600"
              >
                ✕
              </button>
            </div>
            <h2 className="font-poppins text-2xl font-bold text-brown-600 mb-6 text-center">
              Create an account to continue
            </h2>
            <div className="space-y-4">
              <button className="w-full bg-brown-600 text-white py-3 px-6 rounded-lg font-poppins font-medium hover:bg-brown-700 transition-colors">
                Create account
              </button>
              <p className="text-center text-brown-400 font-poppins text-sm">
                Already have an account?{" "}
                <button className="underline hover:text-brown-600">
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
