import { Github, Linkedin } from "lucide-react";

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
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brown-500 transition-colors hover:bg-brown-400">
                <Linkedin className="h-4 w-4 text-white" />
              </div>

              {/* GitHub Icon */}
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brown-500 transition-colors hover:bg-brown-400">
                <Github className="h-4 w-4 text-white" />
              </div>

              {/* Google Icon */}
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brown-500 transition-colors hover:bg-brown-400">
                <span className="font-bold text-lg text-white">G</span>
              </div>
            </div>
          </div>

          {/* Right side - Home page link */}
          <div className="flex justify-center lg:justify-end">
            <a
              href="#"
              className="font-poppins text-base font-medium leading-6 text-brown-600 underline transition-colors hover:text-brown-700"
            >
              Home page
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
