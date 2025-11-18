import { Link } from "react-router-dom";

export const SignupButton = ({
  variant = "desktop",
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses =
    "rounded-full bg-brown-600 px-[42px] py-3 text-white transition-colors duration-200 hover:bg-brown-700 flex items-center justify-center";

  const variantClasses = {
    desktop: "h-12 text-base",
    mobile: "h-12 w-full text-sm text-center",
    page: "h-12 text-base mx-auto",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <Link to="/signup" className={combinedClasses} onClick={onClick} {...props}>
      Sign up
    </Link>
  );
};
