import { forwardRef } from "react";

export const FormInput = forwardRef(
  (
    {
      id,
      name,
      type = "text",
      label,
      placeholder,
      value,
      onChange,
      error,
      required = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`relative pb-2 ${className}`}>
        <label
          htmlFor={id}
          className="block font-poppins text-base font-medium text-brown-400 mb-2"
        >
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-12 px-4 pl-4 pr-3 py-3 rounded-lg border bg-white font-poppins placeholder:text-brown-400 focus:outline-none focus:ring-ней2 focus:ring-brown-200 transition-colors ${
            error
              ? "border-red-500 focus:border-red-500 text-red"
              : value
              ? "border-brown-300 text-brown-500 focus:border-brown-400 focus:text-brown-400"
              : "border-brown-300 text-brown-600 focus:border-brown-400 focus:text-brown-400"
          }`}
          {...props}
        />
        {error && (
          <p className="absolute top-full left-0 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
