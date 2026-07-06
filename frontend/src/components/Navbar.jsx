import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🥗</span>
        <span className="font-bold text-lg text-primary-700">AI NutriChef</span>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden sm:inline text-sm text-gray-600">
              Hi, {user.name.split(" ")[0]}
            </span>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary text-sm">
              Login
            </Link>
            <Link to="/signup" className="btn-primary text-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
