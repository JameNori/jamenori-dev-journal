import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { toast } from "sonner";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { formatDate } from "../lib/utils";

// Import SVG icons from assets
import HappyIcon from "../assets/icons/happy_light.svg";
import CopyIcon from "../assets/icons/Copy_light.svg";
import FacebookIcon from "../assets/icons/Facebook_icon.svg";
import LinkedinIcon from "../assets/icons/LinkedIN_icon.svg";
import TwitterIcon from "../assets/icons/Twitter_icon.svg";

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

      <main className="mx-auto px-4 py-8 lg:px-[120px] lg:max-w-8xl">
        {/* Post Image */}
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[184px] object-cover rounded-2xl lg:w-[1200px] lg:h-[587px] lg:mx-auto"
          />
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Left Content Section */}
          <div className="flex-1 lg:max-w-[813px] lg:mx-auto">
            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-6">
              <span className="rounded-full bg-green-light px-3 py-1 font-poppins text-sm font-medium text-green leading-[22px]">
                {post.category}
              </span>
              <span className="font-poppins text-base font-medium text-brown-400 leading-[24px]">
                {formattedDate}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-poppins text-2xl font-semibold text-brown-600 leading-[32px] mb-4 lg:text-[40px] lg:leading-[48px] lg:mb-6">
              {post.title}
            </h1>

            {/* Description */}
            <p className="font-poppins text-lg text-brown-400 mb-8 font-medium leading-relaxed">
              {post.description}
            </p>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="markdown">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>

            {/* Author Info Section - Mobile Only (Desktop shows in sidebar) */}
            <div className="lg:hidden mb-8">
              <div className="bg-brown-200 rounded-2xl p-6 border border-brown-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={post.image}
                    alt={post.author}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-poppins text-xs font-medium text-brown-400 mb-1">
                      Author
                    </h3>
                    <p className="font-poppins text-xl font-semibold text-brown-500 leading-7">
                      {post.author}
                    </p>
                  </div>
                </div>
                <div className="border-t border-brown-300 my-4"></div>
                <p className="font-poppins text-base font-medium text-brown-400 leading-6">
                  I am a pet enthusiast and freelance writer who specializes in
                  animal behavior and care. With a deep love for cats, I enjoy
                  sharing insights on feline companionship and wellness. When
                  I'm not writing, I spends time volunteering at my local animal
                  shelter, helping cats find loving homes.
                </p>
              </div>
            </div>

            {/* Engagement Section - Like, Copy, Share */}
            <div className="mb-8 flex flex-col gap-6 w-full px-4 py-4 bg-brown-200 rounded-2xl lg:flex-row lg:items-center lg:justify-between lg:w-[813px] lg:h-20 lg:px-6 lg:py-4 lg:gap-0 lg:mx-auto">
              {/* Like Button - Mobile: Full Width, Desktop: Auto */}
              <div className="w-full lg:w-auto">
                <button
                  onClick={handleLike}
                  className="flex items-center justify-center gap-[6px] px-[40px] py-[12px] h-[48px] w-full lg:w-auto rounded-full bg-white border border-brown-300 hover:bg-brown-100 transition-colors"
                >
                  <img src={HappyIcon} alt="like" className="w-6 h-6" />
                  <span className="font-poppins text-base font-medium text-brown-600 leading-6">
                    {likes}
                  </span>
                </button>
              </div>

              {/* Copy Link & Social Media Buttons - Mobile: Same Row, Desktop: Separate */}
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-[6px] px-[28px] py-[12px] h-[48px] rounded-full bg-white border border-brown-300 hover:bg-brown-100 transition-colors"
                >
                  <img src={CopyIcon} alt="copy" className="w-6 h-6" />
                  <span className="font-poppins text-base font-medium text-brown-600 leading-6">
                    Copy link
                  </span>
                </button>

                <button
                  onClick={() => handleSocialShare("facebook")}
                  className=" flex items-center justify-center text-white "
                >
                  <img
                    src={FacebookIcon}
                    alt="facebook"
                    className="w-11 h-11"
                  />
                </button>

                <button
                  onClick={() => handleSocialShare("linkedin")}
                  className=" flex items-center justify-center text-white "
                >
                  <img
                    src={LinkedinIcon}
                    alt="linkedin"
                    className="w-11 h-11"
                  />
                </button>

                <button
                  onClick={() => handleSocialShare("twitter")}
                  className=" flex items-center justify-center text-white "
                >
                  <img src={TwitterIcon} alt="twitter" className="w-11 h-11" />
                </button>
              </div>
            </div>

            {/* Comment Section */}
            <div className="mb-12">
              <h3 className="font-poppins text-base font-medium text-brown-400 leading-6 mb-6">
                Comment
              </h3>

              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full h-[102px] pt-3 pr-1 pb-1 pl-4 border border-brown-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-brown-200 mb-4 font-poppins text-base font-medium leading-6 text-brown-600 placeholder:text-brown-400"
                  onClick={handleComment}
                />
                <div className="flex justify-start lg:justify-end">
                  <button
                    onClick={handleComment}
                    className="flex h-12 w-[121px] items-center justify-center rounded-full bg-brown-600 px-10 py-3 font-poppins text-base font-medium leading-6 text-white transition-colors hover:bg-brown-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Author Info Section - Desktop Only (Mobile shows in content flow) */}
          <div className="hidden lg:block lg:w-76 lg:flex-shrink-0">
            <div className="bg-brown-200 rounded-2xl p-6 border border-brown-200 shadow-sm lg:sticky lg:top-8">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={post.image}
                  alt={post.author}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-poppins text-xs font-medium text-brown-400 mb-1">
                    Author
                  </h3>
                  <p className="font-poppins text-xl font-semibold text-brown-500 leading-7">
                    {post.author}
                  </p>
                </div>
              </div>
              <div className="border-t border-brown-300 my-4"></div>
              <p className="font-poppins text-base font-medium text-brown-400 leading-6">
                I am a pet enthusiast and freelance writer who specializes in
                animal behavior and care. With a deep love for cats, I enjoy
                sharing insights on feline companionship and wellness. When I'm
                not writing, I spends time volunteering at my local animal
                shelter, helping cats find loving homes.
              </p>
            </div>
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
