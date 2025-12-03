import { useState, useEffect } from "react";
import { profileService } from "../services/profile.service.js";

export function HeroSection() {
  const [adminProfile, setAdminProfile] = useState({
    name: "Loading...",
    bio: "",
    profilePic: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await profileService.getAdminProfile();
        setAdminProfile({
          name: profile.name || "Author",
          bio: profile.bio || "",
          profilePic: profile.profilePic || null,
        });
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        // ใช้ default values ถ้า error
        setAdminProfile({
          name: "Author",
          bio: "",
          profilePic: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  // แบ่ง bio เป็น paragraphs (ถ้ามี)
  // ถ้า bio มี newline (\n) ให้แบ่งเป็น paragraphs
  // ถ้าไม่มี ให้แสดงเป็น paragraph เดียว
  const bioParagraphs = adminProfile.bio
    ? adminProfile.bio.split("\n").filter((p) => p.trim())
    : [];

  return (
    <section className="bg-brown-100">
      <div className="max-w-8xl mx-auto px-4 lg:px-[120px]">
        {/* Single Layout with Responsive Classes */}
        <div className="flex flex-col gap-10 py-10 lg:grid lg:grid-cols-3 lg:items-center lg:gap-15">
          {/* Left Column - Text Content */}
          <div className="space-y-4 text-center lg:space-y-6 lg:text-right">
            <h1 className="text-center text-[40px] font-poppins font-semibold leading-12 text-brown-600 lg:text-right lg:text-[52px] lg:leading-15">
              {/* Mobile: Single line */}
              <span className="lg:hidden">Stay Informed, Stay Inspired</span>

              {/* Desktop: Multi-line */}
              <span className="hidden lg:block">
                Stay
                <br />
                Informed,
                <br />
                Stay Inspired
              </span>
            </h1>

            <p className="text-center text-base font-poppins font-medium leading-6 text-brown-400 lg:text-right">
              {/* Mobile */}
              <span className="lg:hidden">
                Discover a World of Knowledge at Your Fingertips. Your Daily
                Dose of Inspiration and Information.
              </span>

              {/* Desktop */}
              <span className="hidden lg:block">
                Discover a World of Knowledge at Your
                <br />
                Fingertips. Your Daily Dose of Inspiration
                <br />
                and Information.
              </span>
            </p>
          </div>

          {/* Middle Column - Image */}
          <div className="flex justify-center">
            <div className="relative">
              {isLoading || !adminProfile.profilePic ? (
                <div className="h-[470px] w-[343px] rounded-2xl bg-brown-200 animate-pulse flex items-center justify-center lg:h-[529px] lg:w-[386px]">
                  <p className="font-poppins text-brown-400">
                    Loading image...
                  </p>
                </div>
              ) : (
                <img
                  src={adminProfile.profilePic}
                  alt={adminProfile.name || "Hero Image"}
                  className="h-[470px] w-[343px] rounded-2xl object-cover lg:h-[529px] lg:w-[386px]"
                />
              )}
            </div>
          </div>

          {/* Right Column - Author Info */}
          <div className="space-y-3 text-left lg:space-y-4">
            <p className="text-xs font-poppins font-medium uppercase leading-5 tracking-wide text-brown-400">
              -Author
            </p>
            <h2 className="text-2xl font-poppins font-semibold leading-8 text-brown-500">
              {isLoading ? "Loading..." : adminProfile.name}
            </h2>
            <div className="space-y-3 text-base font-poppins font-medium leading-6 text-brown-400 lg:space-y-4">
              {isLoading ? (
                <p>Loading bio...</p>
              ) : bioParagraphs.length > 0 ? (
                bioParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>No bio available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
