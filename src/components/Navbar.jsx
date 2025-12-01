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
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          className="cursor-pointer"
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
        />
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to={"/applications"}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Applied Jobs
            </Link>
            <p className="text-gray-300">|</p>
            <p className="max-sm:hidden text-gray-700">
              Hi, {user.firstName + " " + user.lastName}
            </p>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs items-center">
            <button
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              onClick={(e) => setShowRecruiterLogin(true)}
            >
              Recruiter Login
            </button>
            <button
              className="text-gray-600 max-sm:text-xs hover:text-blue-600 transition-colors duration-200"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin
            </button>
            <button
              onClick={(e) => openSignIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-9 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
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
