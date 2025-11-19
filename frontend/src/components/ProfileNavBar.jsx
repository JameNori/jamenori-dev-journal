import { Menu, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NotificationBellIcon } from "./icons/NotificationBellIcon";

export function ProfileNavBar({ userName = "Moodeng ja", userAvatar }) {
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
                  className="ml-3 mr-3 w-[calc(100vw-24px)] rounded-2xl border border-brown-300 bg-white shadow-lg"
                >
                  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brown-300">
                        <User className="h-5 w-5 text-brown-600" />
                      </div>
                    )}
                    <span className="font-poppins text-base font-medium text-brown-600">
                      {userName}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/profile"
                      className="w-full px-4 py-3 font-poppins text-base font-medium text-brown-600 hover:text-brown-700"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/logout"
                      className="w-full px-4 py-3 font-poppins text-base font-medium text-brown-600 hover:text-brown-700"
                    >
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Notification & User */}
            <div className="hidden items-center gap-4 lg:flex">
              <button
                type="button"
                className="transition-transform duration-200 hover:scale-105"
                aria-label="Notifications"
              >
                <NotificationBellIcon />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-brown-200">
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
                  className="w-48 rounded-2xl border border-brown-300 bg-white shadow-lg"
                >
                  <DropdownMenuItem>
                    <Link
                      to="/profile"
                      className="w-full font-poppins text-base font-medium text-brown-600 hover:text-brown-700"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/logout"
                      className="w-full font-poppins text-base font-medium text-brown-600 hover:text-brown-700"
                    >
                      Log out
                    </Link>
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
