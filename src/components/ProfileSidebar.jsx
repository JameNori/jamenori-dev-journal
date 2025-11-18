import { Link, useLocation } from "react-router-dom";
import { ProfileIcon } from "./icons/ProfileIcon";
import { ResetIcon } from "./icons/ResetIcon";

export function ProfileSidebar({ className = "", variant = "desktop" }) {
  const location = useLocation();
  const isMobile = variant === "mobile";

  const menuItems = [
    {
      path: "/profile",
      label: "Profile",
      icon: ProfileIcon,
      active: location.pathname === "/profile",
    },
    {
      path: "/profile/reset-password",
      label: "Reset password",
      icon: ResetIcon,
      active: location.pathname === "/profile/reset-password",
    },
  ];

  const Wrapper = isMobile ? "nav" : "aside";
  const wrapperClasses = `${
    isMobile
      ? "mx-auto flex w-full items-center gap-8 border-y border-brown-200 bg-brown-100 px-4 py-3"
      : "w-full p-4 lg:p-6"
  } ${className}`;
  const containerClasses = isMobile
    ? "flex items-center gap-8"
    : "flex flex-col gap-2";
  const itemBaseClasses = isMobile
    ? "inline-flex items-center gap-3 transition-colors duration-200"
    : "flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors";
  const activeClasses = isMobile
    ? "font-medium text-brown-500"
    : "font-medium text-brown-500";
  const inactiveClasses = isMobile
    ? "text-brown-400 hover:text-brown-500"
    : "text-brown-400 hover:bg-brown-200 hover:text-brown-500";
  const textClasses = `font-poppins text-base font-medium whitespace-nowrap${
    isMobile ? " leading-6" : ""
  }`;

  return (
    <Wrapper className={wrapperClasses}>
      <div className={containerClasses}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const itemClasses = `${itemBaseClasses} ${
            item.active ? activeClasses : inactiveClasses
          }`;

          return (
            <Link key={item.path} to={item.path} className={itemClasses}>
              {Icon && <Icon className="h-6 w-6" />}
              <span className={textClasses}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </Wrapper>
  );
}
