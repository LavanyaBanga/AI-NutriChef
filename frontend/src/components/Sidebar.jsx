import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/recipe-generator", label: "Recipe Generator", icon: "🍳" },
  { to: "/meal-planner", label: "Meal Planner", icon: "📅" },
  { to: "/grocery-list", label: "Grocery List", icon: "🛒" },
  { to: "/chatbot", label: "Nutrition Chatbot", icon: "💬" },
  { to: "/saved-recipes", label: "Saved Recipes", icon: "📖" },
];

const Sidebar = () => {
  return (
    <aside className="w-full sm:w-56 bg-white border-r border-gray-200 sm:h-[calc(100vh-57px)] sm:sticky sm:top-[57px]">
      <nav className="flex sm:flex-col overflow-x-auto sm:overflow-visible p-2 sm:p-4 gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
