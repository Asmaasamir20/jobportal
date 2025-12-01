import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

/**
 * Navbar Component
 * شريط التنقل الرئيسي في الموقع
 */
const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  const { setShowRecruiterLogin, setShowAdminLogin } = useContext(AppContext);
  return (
    <div className="shadow py-3 sm:py-4">
      <div className="px-4 sm:px-5 flex justify-between items-center gap-2">
        <img
          className="cursor-pointer h-8 sm:h-auto max-w-[120px] sm:max-w-none"
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
        />
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={"/applications"}
              className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
            >
              Applied Jobs
            </Link>
            <p className="text-gray-300 hidden sm:block">|</p>
            <p className="hidden sm:block text-sm text-gray-700">
              Hi, {user.firstName + " " + user.lastName}
            </p>
            <div className="scale-90 sm:scale-100">
              <UserButton />
            </div>
          </div>
        ) : (
          <div className="flex gap-2 sm:gap-4 items-center">
            <button
              className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
              onClick={(e) => setShowRecruiterLogin(true)}
            >
              <span className="hidden sm:inline">Recruiter Login</span>
              <span className="sm:hidden">Recruiter</span>
            </button>
            <button
              className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin
            </button>
            <button
              onClick={(e) => openSignIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 lg:px-9 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
