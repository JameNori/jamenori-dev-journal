// NavBar Component
function NavBar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/src/assets/logos/hh..svg"
              alt="hh. Logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Log in
            </button>
            <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// HeroSection Component
function HeroSection() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-1 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Stay
              <br />
              Informed,
              <br />
              Stay Inspired
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Discover a World of Knowledge at Your
              <br />
              Fingertips. Your Daily Dose of Inspiration
              <br />
              and Information.
            </p>
          </div>

          {/* Middle Column - Image */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative">
              <img
                src="/src/assets/images/16_9 img.png"
                alt="Hero Image"
                className="w-80 h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Right Column - Author Info */}
          <div className="lg:col-span-1 space-y-4">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              -Author
            </p>
            <h2 className="text-2xl font-bold text-gray-800">Thompson P.</h2>
            <div className="space-y-4 text-gray-500 leading-relaxed">
              <p>
                I am a pet enthusiast and freelance writer who specializes in
                animal behavior and care. With a deep love for cats, I enjoy
                sharing insights on feline companionship and wellness.
              </p>
              <p>
                When I'm not writing, I spends time volunteering at my local
                animal shelter, helping cats find loving homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <HeroSection />
    </div>
  );
}
export default App;
