export function ProfileSuccessModal({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0">
      <div className="relative w-[359px] rounded-lg bg-green p-4 shadow-lg lg:w-[700px]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
          aria-label="Close notification"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex flex-col gap-3 pr-8">
          <p className="font-poppins text-xl font-semibold leading-7 text-white">
            Saved profile
          </p>
          <p className="font-poppins text-sm font-medium leading-[22px] text-white">
            Your profile has been successfully updated
          </p>
        </div>
      </div>
    </div>
  );
}
