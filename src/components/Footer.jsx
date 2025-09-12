import { Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Left side - Get in touch with icons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-gray-700 font-medium">Get in touch</span>
            <div className="flex items-center space-x-3">
              {/* LinkedIn Icon */}
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4 text-white" />
              </div>

              {/* GitHub Icon */}
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                <Github className="w-4 h-4 text-white" />
              </div>

              {/* Google Icon */}
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                <span className="text-white font-bold text-sm">G</span>
              </div>
            </div>
          </div>

          {/* Right side - Home page link */}
          <div className="text-center sm:text-right">
            <a
              href="#"
              className="text-gray-700 underline hover:text-gray-900 transition-colors"
            >
              Home page
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
