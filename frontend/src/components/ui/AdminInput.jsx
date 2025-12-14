import { forwardRef } from "react";

export const AdminInput = forwardRef(
  (
    {
      type = "text",
      placeholder,
      value,
      onChange,
      readOnly = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "h-12 w-full rounded-lg border border-brown-300 bg-white py-3 pl-4 pr-3 font-poppins text-base font-medium leading-6 text-brown-500 placeholder:text-brown-400 focus:border-brown-400 focus:outline-none transition-colors";

    const readOnlyClasses =
      "bg-brown-200 text-brown-400 opacity-40 cursor-not-allowed";

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`${baseClasses} ${
          readOnly ? readOnlyClasses : ""
        } ${className}`}
        {...props}
      />
    );
  }
);

AdminInput.displayName = "AdminInput";
