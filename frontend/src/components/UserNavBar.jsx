import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBar } from "./NavBar";
import { ProfileNavBar } from "./ProfileNavBar";
import { tokenUtils } from "../utils/token.js";
import { profileService } from "../services/profile.service.js";

export function UserNavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginAndFetchProfile = async () => {
      const hasToken = tokenUtils.hasToken();
      setIsLoggedIn(hasToken);

      if (hasToken) {
        try {
          const profile = await profileService.getProfile();
          setUserProfile({
            name: profile.name || "",
            avatar: profile.profilePic || null,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          // ถ้า token หมดอายุหรือ invalid ให้ลบ token
          tokenUtils.removeToken();
          setIsLoggedIn(false);
        }
      }
      setIsLoading(false);
    };

    checkLoginAndFetchProfile();
  }, []);

  // แสดง loading skeleton ที่เป็นกลาง
  if (isLoading) {
    return (
      <nav className="bg-brown-100 border-b border-brown-300">
        <div className="px-6 py-3 lg:px-[120px] lg:py-4">
          <div className="flex h-full items-center justify-between">
            {/* Left side - Logo */}
            <Link to="/" className="flex items-center gap-4">
              <img
                src="/src/assets/logos/hh..svg"
                alt="hh. Logo"
                className="h-6 w-auto sm:h-7 md:h-8 lg:h-9"
              />
            </Link>

            {/* Right side - Loading Skeleton */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Skeleton */}
              <div className="lg:hidden">
                <div className="h-6 w-6 rounded bg-brown-200 animate-pulse"></div>
              </div>

              {/* Desktop Skeleton */}
              <div className="hidden items-center gap-4 lg:flex">
                <div className="h-12 w-12 rounded-full bg-brown-200 animate-pulse"></div>
                <div className="h-6 w-24 rounded bg-brown-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // ถ้า login แล้ว แสดง ProfileNavBar
  if (isLoggedIn) {
    return (
      <ProfileNavBar
        userName={userProfile.name || "User"}
        userAvatar={userProfile.avatar}
      />
    );
  }

  // ถ้ายังไม่ login แสดง NavBar ธรรมดา
  return <NavBar />;
}
