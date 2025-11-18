export const ErrorPopup = ({ message, description, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-red-500 rounded-lg shadow-lg p-4 pr-10 max-w-[400px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-100 transition-colors font-bold text-lg leading-none"
          aria-label="Close error message"
        >
          ✕
        </button>

        {/* Error Messages */}
        <div className="flex flex-col gap-1">
          <p className="font-poppins text-base font-semibold text-white">
            {message}
          </p>
          {description && (
            <p className="font-poppins text-sm font-normal text-white">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
