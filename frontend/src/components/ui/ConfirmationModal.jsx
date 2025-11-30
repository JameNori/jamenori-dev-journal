import { CloseIcon } from "../icons/CloseIcon";

export function ConfirmationModal({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[477px] rounded-2xl bg-white pt-4 pr-6 pb-10 pl-6 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-brown-600 transition-colors hover:bg-brown-100"
          aria-label="Close modal"
        >
          <CloseIcon className="h-6 w-6" stroke="currentColor" />
        </button>

        {/* Title */}
        <h2 className="mt-10 mb-6 font-poppins text-2xl font-semibold leading-8 text-brown-600 text-center">
          {title}
        </h2>

        {/* Message */}
        <p className="mb-6 font-poppins text-base font-medium leading-6 text-brown-400 text-center">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-2">
          <button
            onClick={onClose}
            className="h-12 rounded-full border border-brown-400 bg-white px-10 py-3 font-poppins text-base font-medium leading-6 text-brown-600 transition-colors hover:bg-brown-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-12 rounded-full bg-brown-600 px-10 py-3 font-poppins text-base font-medium leading-6 text-white transition-colors hover:bg-brown-700"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
