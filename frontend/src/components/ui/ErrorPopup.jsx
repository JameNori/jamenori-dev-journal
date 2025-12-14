export const ErrorPopup = ({ message, description, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative w-[700px] rounded-[8px] bg-red p-4 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white transition-colors hover:text-white/80 font-bold text-lg leading-none"
          aria-label="Close error message"
        >
          ✕
        </button>

        <div className="flex flex-col gap-3 pr-10">
          <p className="font-poppins text-[20px] font-semibold leading-[28px] text-white">
            {message}
          </p>
          {description && (
            <p className="font-poppins text-sm font-medium leading-[22px] text-white">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
