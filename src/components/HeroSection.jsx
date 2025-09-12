export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Layout - Vertical */}
        <div className="lg:hidden space-y-6  rounded-lg p-6">
          {/* Text Content - Top */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              Stay Informed, Stay Inspired
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose
              of Inspiration and Information.
            </p>
          </div>

          {/* Image - Center */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/src/assets/images/16_9 img.png"
                alt="Hero Image"
                className="w-full max-w-xs h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Author Info - Bottom */}
          <div className="text-left space-y-3">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              -Author
            </p>
            <h2 className="text-xl font-bold text-gray-800">Thompson P.</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
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

        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 text-left">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
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
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/src/assets/images/16_9 img.png"
                alt="Hero Image"
                className="w-80 h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Right Column - Author Info */}
          <div className="space-y-4 text-left">
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              -Author
            </p>
            <h2 className="text-2xl font-bold text-gray-800">Thompson P.</h2>
            <div className="space-y-4 text-base text-gray-500 leading-relaxed">
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
