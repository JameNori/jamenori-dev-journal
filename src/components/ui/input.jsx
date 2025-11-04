import { forwardRef } from "react";

export const Input = forwardRef(
  (
    { type = "text", placeholder, value, onChange, className = "", ...props },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg border border-brown-300 bg-white text-brown-600 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-200 focus:border-brown-400 transition-colors ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
