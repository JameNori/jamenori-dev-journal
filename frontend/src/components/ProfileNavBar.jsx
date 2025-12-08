import { Menu, User, ChevronDown, RotateCcw, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { NotificationBellIcon } from "./icons/NotificationBellIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { ResetIcon } from "./icons/ResetIcon";
import { LogOutIcon } from "./icons/LogOutIcon";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import { authService } from "../services/auth.service.js";

export function ProfileNavBar({
  userName = "Moodeng ja",
  userAvatar,
  userRole,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  // Helper functions สำหรับ links ตาม role
  const getProfileLink = () => {
    return userRole === "admin" ? "/admin/profile" : "/profile";
  };

  const getResetPasswordLink = () => {
    return userRole === "admin" ? "/admin/reset-password" : "/reset-password";
  };

  const isAdmin = userRole === "admin";

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

          {/* Right side - Controls */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-2 text-brown-400 transition-colors hover:text-brown-600"
                    aria-label="Open menu"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="ml-3 mr-3 w-[calc(100vw-24px)] rounded-2xl border border-brown-300 bg-brown-100 shadow-[2px_2px_16px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4"
                >
                  <DropdownMenuItem className="flex items-center justify-between gap-3 p-0">
                    <div className="flex items-center gap-3">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="!h-12 !w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brown-300">
                          <User className="!h-5 !w-5 text-brown-600" />
                        </div>
                      )}
                      <span className="font-poppins text-base font-medium leading-6 text-brown-500">
                        {userName}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="transition-transform duration-200 hover:scale-105"
                      aria-label="Notifications"
                    >
                      <NotificationBellIcon iconClassName="!h-12 !w-12" />
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to={getProfileLink()}
                      className="flex items-center gap-3 w-full font-poppins text-base font-medium leading-6 text-brown-500 hover:text-brown-600"
                    >
                      <ProfileIcon className="!h-6 !w-6 text-brown-500" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to={getResetPasswordLink()}
                      className="flex items-center gap-3 w-full font-poppins text-base font-medium leading-6 text-brown-500 hover:text-brown-600"
                    >
                      <ResetIcon className="!h-6 !w-6 text-brown-500" />
                      Reset password
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link
                        to="/admin/article-management"
                        className="flex items-center gap-3 w-full font-poppins text-base font-medium leading-6 text-brown-500 hover:text-brown-600"
                      >
                        <ExternalLinkIcon className="!h-6 !w-6 text-brown-500" />
                        Admin panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-brown-300 -mx-6" />
                  <DropdownMenuItem asChild>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left font-poppins text-base font-medium leading-6 text-brown-500 hover:text-brown-600"
                    >
                      <LogOutIcon className="!h-6 !w-6 text-brown-500" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Notification & User */}
            <div className="hidden items-center gap-4 lg:flex">
              <button
                type="button"
                className="h-12 w-12 flex items-center justify-center transition-transform duration-200 hover:scale-105"
                aria-label="Notifications"
              >
                <NotificationBellIcon />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg transition-colors hover:bg-brown-200 h-12">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brown-300">
                        <User className="h-6 w-6 text-brown-600" />
                      </div>
                    )}
                    <span className="hidden md:block font-poppins text-base font-medium text-brown-600">
                      {userName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-brown-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-2xl border border-brown-300 bg-white shadow-lg p-2"
                >
                  <DropdownMenuItem>
                    <Link
                      to={getProfileLink()}
                      className="flex items-center gap-3 w-full font-poppins text-base font-medium leading-6 text-brown-500 hover:text-brown-600"
                    >
                      <ProfileIcon className="h-6 w-6 text-brown-500" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to={getResetPasswordLink()}
                      className="flex items-center gap-3 w-full font-poppins text-base font-medium leading-6 text-brown-500 hover:text-brown-600"
                    >
                      <ResetIcon className="h-6 w-6 text-brown-500" />
                      Reset password
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link
                        to="/admin/article-management"
                        className="flex items-center gap-3 w-full font-poppins text-base font-medium leading-6 text-brown-500 hover:text-brown-600"
                      >
                        <ExternalLinkIcon className="h-6 w-6 text-brown-500" />
                        Admin panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-brown-300 my-1" />
                  <DropdownMenuItem asChild>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left font-poppins text-base font-medium leading-6 text-brown-500 hover:text-brown-600"
                    >
                      <LogOutIcon className="h-6 w-6 text-brown-500" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
