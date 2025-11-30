import { CloseIcon } from "../icons/CloseIcon";

export function SuccessModal({ isVisible, onClose, title, description }) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0">
      <div className="relative w-[359px] rounded-lg bg-green p-4 shadow-lg lg:w-[700px]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
          aria-label="Close notification"
        >
          <CloseIcon className="h-6 w-6" stroke="currentColor" />
        </button>
        <div className="flex flex-col gap-3 pr-8">
          <p className="font-poppins text-xl font-semibold leading-7 text-white">
            {title}
          </p>
          <p className="font-poppins text-sm font-medium leading-[22px] text-white">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
