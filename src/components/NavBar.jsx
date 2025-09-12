export function NavBar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
            <button className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="px-6 py-2 text-base text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Log in
            </button>
            <button className="px-6 py-2 text-base bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
