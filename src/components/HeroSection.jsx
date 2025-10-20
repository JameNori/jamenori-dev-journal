export function HeroSection() {
  return (
    <section className="bg-brown-100">
      <div className="max-w-8xl mx-auto px-4 lg:px-[120px]">
        {/* Single Layout with Responsive Classes */}
        <div className="flex flex-col gap-10 py-10 lg:grid lg:grid-cols-3 lg:items-center lg:gap-15">
          {/* Left Column - Text Content */}
          <div className="space-y-4 text-center lg:space-y-6 lg:text-right">
            <h1 className="text-center text-[40px] font-poppins font-semibold leading-12 text-brown-600 lg:text-right lg:text-[52px] lg:leading-15">
              {/* Mobile: Single line */}
              <span className="lg:hidden">Stay Informed, Stay Inspired</span>

              {/* Desktop: Multi-line */}
              <span className="hidden lg:block">
                Stay
                <br />
                Informed,
                <br />
                Stay Inspired
              </span>
            </h1>

            <p className="text-center text-base font-poppins font-medium leading-6 text-brown-400 lg:text-right">
              {/* Mobile */}
              <span className="lg:hidden">
                Discover a World of Knowledge at Your Fingertips. Your Daily
                Dose of Inspiration and Information.
              </span>

              {/* Desktop */}
              <span className="hidden lg:block">
                Discover a World of Knowledge at Your
                <br />
                Fingertips. Your Daily Dose of Inspiration
                <br />
                and Information.
              </span>
            </p>
          </div>

          {/* Middle Column - Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/src/assets/images/16_9 img.png"
                alt="Hero Image"
                className="h-[470px] w-[343px] rounded-2xl object-cover lg:h-[529px] lg:w-[386px]"
              />
            </div>
          </div>

          {/* Right Column - Author Info */}
          <div className="space-y-3 text-left lg:space-y-4">
            <p className="text-xs font-poppins font-medium uppercase leading-5 tracking-wide text-brown-400">
              -Author
            </p>
            <h2 className="text-2xl font-poppins font-semibold leading-8 text-brown-500">
              Thompson P.
            </h2>
            <div className="space-y-3 text-base font-poppins font-medium leading-6 text-brown-400 lg:space-y-4">
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
