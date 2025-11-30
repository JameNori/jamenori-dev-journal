import { forwardRef } from "react";

export const AdminTextarea = forwardRef(
  (
    { placeholder, value, onChange, maxLength, rows, className = "", ...props },
    ref
  ) => {
    const baseClasses =
      "w-full resize-y rounded-lg border border-brown-300 bg-white pt-3 pr-1 pb-1 pl-4 font-poppins text-base font-medium leading-6 text-brown-500 placeholder:text-brown-400 focus:border-brown-400 focus:outline-none transition-colors";

    return (
      <textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={rows}
        className={`${baseClasses} ${className}`}
        {...props}
      />
    );
  }
);

AdminTextarea.displayName = "AdminTextarea";
