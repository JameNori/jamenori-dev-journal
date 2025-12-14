// Import SVG icon components
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { GithubIcon } from "./icons/GithubIcon";
import { GoogleIcon } from "./icons/GoogleIcon";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-brown-200">
      <div className="mx-auto px-4 py-10 lg:px-[120px] lg:py-[60px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          {/* Left side - Get in touch with icons */}
          <div className="flex flex-row items-center justify-center gap-4 lg:flex-row lg:items-center">
            <span className="font-poppins text-base font-medium leading-6 text-brown-500">
              Get in touch
            </span>
            <div className="flex items-center space-x-3">
              {/* LinkedIn Icon */}
              <div className="flex cursor-pointer items-center justify-center">
                <LinkedinIcon className="h-6 w-6 text-brown-500" />
              </div>

              {/* GitHub Icon */}
              <div className="flex cursor-pointer items-center justify-center">
                <GithubIcon className="h-6 w-6 text-brown-500" />
              </div>

              {/* Google Icon */}
              <div className="flex cursor-pointer items-center justify-center">
                <GoogleIcon className="h-6 w-6 text-brown-500" />
              </div>
            </div>
          </div>

          {/* Right side - Home page link */}
          <div className="flex justify-center lg:justify-end">
            <Link
              to="/"
              className="font-poppins text-base font-medium leading-6 text-brown-600 underline transition-colors hover:text-brown-700"
            >
              Home page
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
