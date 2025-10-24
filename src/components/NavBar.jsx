import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NavBar() {
  return (
    <nav className="bg-brown-100 border-b border-brown-300">
      <div className="px-6 py-3 lg:px-[120px] lg:py-4">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/src/assets/logos/hh..svg"
              alt="hh. Logo"
              className="h-6 w-auto sm:h-7 md:h-8 lg:h-9"
            />
          </div>

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
                  <button className="h-12 w-full rounded-full border border-brown-400 bg-white px-10 py-3 text-center text-sm text-brown-400 hover:bg-gray-50">
                    Log in
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button className="h-12 w-full rounded-full bg-brown-600 px-10 py-3 text-center text-sm text-white hover:bg-brown-700">
                    Sign up
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden items-center space-x-4 lg:flex">
            <button className="h-12 rounded-full border border-brown-400 bg-white px-10 py-3 text-base text-brown-400 transition-colors duration-200 hover:bg-gray-50">
              Log in
            </button>
            <button className="h-12 rounded-full bg-brown-600 px-10 py-3 text-base text-white transition-colors duration-200 hover:bg-brown-700">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
