import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArticleIcon } from "./icons/ArticleIcon";
import { FolderIcon } from "./icons/FolderIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { BellIcon } from "./icons/BellIcon";
import { ResetIcon } from "./icons/ResetIcon";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import { LogOutIcon } from "./icons/LogOutIcon";
import hhLogo from "../assets/logos/hh..svg";
import { authService } from "../services/auth.service.js";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/admin/article-management",
      label: "Article management",
      icon: ArticleIcon,
      active: location.pathname.startsWith("/admin/article-management"),
    },
    {
      path: "/admin/category-management",
      label: "Category management",
      icon: FolderIcon,
      active: location.pathname.startsWith("/admin/category-management"),
    },
    {
      path: "/admin/profile",
      label: "Profile",
      icon: ProfileIcon,
      active: location.pathname.startsWith("/admin/profile"),
    },
    {
      path: "/admin/notification",
      label: "Notification",
      icon: BellIcon,
      active: location.pathname.startsWith("/admin/notification"),
    },
    {
      path: "/admin/reset-password",
      label: "Reset password",
      icon: ResetIcon,
      active: location.pathname.startsWith("/admin/reset-password"),
    },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <aside className="flex h-[1024px] w-[280px] flex-col border-r border-brown-300 bg-brown-200 pt-4 pb-4">
      <div className="flex flex-col gap-1 border-b border-brown-300 px-6 pb-[60px] pt-[60px]">
        <img src={hhLogo} alt="hh. Logo" className="h-[60px] w-[60px]" />
        <p className="font-poppins text-xl font-semibold leading-6 text-orange">
          Admin panel
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 font-poppins text-base font-medium leading-6 transition-colors ${
                item.active ? "bg-brown-300 text-brown-500" : "text-brown-400"
              }`}
            >
              <Icon className="h-6 w-6" stroke="currentColor" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-brown-300 pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 font-poppins text-base font-medium leading-6 text-brown-400 transition-colors hover:bg-brown-200"
        >
          <ExternalLinkIcon
            className="h-6 w-6"
            stroke="currentColor"
            fill="currentColor"
          />
          <span>hh. website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-4 py-3 font-poppins text-base font-medium leading-6 text-brown-400 transition-colors hover:bg-brown-200 w-full text-left"
        >
          <LogOutIcon
            className="h-6 w-6"
            stroke="currentColor"
            fill="currentColor"
          />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
