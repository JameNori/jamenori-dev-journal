import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SignupButton } from "./ui/SignupButton";

export function NavBar() {
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-brown-400 focus:outline-none hover:text-brown-600">
                  <Menu className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[calc(100vw-24px)] ml-3 mr-3 rounded-2xl border border-brown-300 bg-white shadow-lg"
              >
                <DropdownMenuItem>
                  <Link
                    to="/login"
                    className="h-12 w-full rounded-full border border-brown-400 bg-white px-10 py-3 text-center text-sm text-brown-400 hover:bg-gray-50 flex items-center justify-center"
                  >
                    Log in
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignupButton variant="mobile" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/login"
              className="h-12 rounded-full border border-brown-400 bg-white px-10 text-base text-brown-400 transition-colors duration-200 hover:bg-gray-50 flex items-center justify-center"
            >
              Log in
            </Link>
            <SignupButton variant="desktop" />
          </div>
        </div>
      </div>
    </nav>
  );
}
