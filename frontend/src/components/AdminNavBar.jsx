import { PlusIcon } from "./icons/PlusIcon";

export function AdminNavBar({ title, actionButton, actionButtons }) {
  const baseClasses =
    "flex min-h-[96px] items-center justify-between border-b border-brown-300 bg-white px-8 py-6";

  if (!actionButton && !actionButtons) {
    return (
      <div className={baseClasses}>
        <h1 className="font-poppins text-2xl font-semibold leading-8 text-brown-600">
          {title}
        </h1>
      </div>
    );
  }

  // Handle multiple action buttons (for Create Article page)
  if (actionButtons && Array.isArray(actionButtons)) {
    return (
      <div className={baseClasses}>
        <h1 className="font-poppins text-2xl font-semibold leading-8 text-brown-600">
          {title}
        </h1>
        <div className="flex items-center gap-4">
          {actionButtons.map((btn, index) => {
            const {
              label,
              onClick,
              disabled,
              variant = "primary",
              loadingText,
            } = btn;
            const buttonContent = loadingText || label;

            const buttonClasses =
              variant === "secondary"
                ? `flex h-12 items-center gap-1.5 rounded-full border border-brown-400 bg-white px-10 py-3 font-poppins text-base font-medium leading-6 text-brown-600 transition-colors hover:bg-brown-100 ${
                    disabled ? "cursor-not-allowed opacity-50" : ""
                  }`
                : `flex h-12 items-center gap-1.5 rounded-full bg-brown-600 px-10 py-3 font-poppins text-base font-medium leading-6 text-white transition-colors hover:bg-brown-700 ${
                    disabled ? "cursor-not-allowed opacity-50" : ""
                  }`;

            return (
              <button
                key={index}
                onClick={onClick}
                disabled={disabled}
                className={buttonClasses}
              >
                <span>{buttonContent}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Handle single action button (existing behavior)
  const {
    label,
    onClick,
    disabled,
    showIcon = true,
    loadingText,
  } = actionButton;

  const buttonContent = loadingText || label;

  return (
    <div className={baseClasses}>
      <h1 className="font-poppins text-2xl font-semibold leading-8 text-brown-600">
        {title}
      </h1>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex h-12 items-center gap-1.5 rounded-full bg-brown-600 px-10 py-3 font-poppins text-base font-medium leading-6 text-white transition-colors hover:bg-brown-700 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {showIcon && <PlusIcon className="h-6 w-6" stroke="currentColor" />}
        <span>{buttonContent}</span>
      </button>
    </div>
  );
}
