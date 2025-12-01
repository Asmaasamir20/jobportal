import { useContext, useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

/**
 * Dashboard Component
 * Main dashboard layout for recruiter panel
 * Professional design matching Admin Dashboard theme
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  // Reset image error when companyData changes
  useEffect(() => {
    setImageError(false);
  }, [companyData?.image]);

  /**
   * Logout function for company/recruiter
   * Clears authentication data and redirects to home
   */
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    navigate("/");
  };

  /**
   * Sync company data from localStorage if context is empty
   * This ensures data persists after page refresh or project restart
   */
  useEffect(() => {
    // Only sync if context doesn't have data
    if (!companyData) {
      const savedCompanyData = localStorage.getItem("companyData");
      const savedToken = localStorage.getItem("companyToken");

      if (savedToken && savedCompanyData) {
        try {
          const parsedData = JSON.parse(savedCompanyData);

          // Check if image is a blob URL (old format) - if so, remove it
          if (parsedData.image && parsedData.image.startsWith("blob:")) {
            parsedData.image = null;
            // Update localStorage with corrected data
            localStorage.setItem("companyData", JSON.stringify(parsedData));
            // Also update in companies array
            const companies = JSON.parse(
              localStorage.getItem("companies") || "[]"
            );
            const companyIndex = companies.findIndex(
              (c) => c.email === parsedData.email
            );
            if (companyIndex !== -1) {
              companies[companyIndex].image = null;
              localStorage.setItem("companies", JSON.stringify(companies));
            }
          }

          setCompanyData(parsedData);
          setCompanyToken(savedToken);
        } catch (error) {
          console.error("Error loading company data:", error);
        }
      }
    }
  }, [companyData, setCompanyData, setCompanyToken]);

  /**
   * Redirect to manage-jobs when company data is loaded
   * Only redirect if on the base dashboard route to avoid infinite loops
   */
  useEffect(() => {
    if (companyData && location.pathname === "/dashboard") {
      navigate("/dashboard/manage-jobs", { replace: true });
    }
  }, [companyData, location.pathname, navigate]);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar for Recruiter Panel - Enhanced Design */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              onClick={() => navigate("/")}
              className="max-sm:w-32 cursor-pointer hover:opacity-80 transition-opacity"
              src={assets.logo}
              alt="Logo"
            />
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <h1 className="hidden md:block text-lg font-semibold text-gray-800">
              Recruiter Dashboard
            </h1>
          </div>
          {companyData && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-sm font-medium text-blue-700">
                  Welcome, {companyData.name}
                </p>
              </div>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all overflow-hidden border-2 border-gray-200"
                >
                  {companyData.image && !imageError ? (
                    <img
                      src={companyData.image}
                      alt={companyData.name}
                      className="w-full h-full object-cover"
                      onError={() => {
                        // If image fails to load, show placeholder
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {companyData.name?.charAt(0) || "C"}
                      </span>
                    </div>
                  )}
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 z-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {companyData.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {companyData.email}
                      </p>
                    </div>
                    <ul className="list-none m-0">
                      <li
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="py-2.5 px-4 cursor-pointer hover:bg-red-50 text-red-600 text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start">
        {/* Left Sidebar - Enhanced Design */}
        <div className="inline-block min-h-screen border-r-2 bg-gray-50 w-64">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-3 w-full transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-medium shadow-sm"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
              to={"/dashboard/add-job"}
            >
              <img
                className="min-w-5 h-5"
                src={assets.add_icon}
                alt="Add Job"
              />
              <p className="max-sm:hidden">Add Job</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-3 w-full transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-medium shadow-sm"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
              to={"/dashboard/manage-jobs"}
            >
              <img
                className="min-w-5 h-5"
                src={assets.home_icon}
                alt="Manage Jobs"
              />
              <p className="max-sm:hidden">Manage Jobs</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-3 w-full transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-medium shadow-sm"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
              to={"/dashboard/view-applications"}
            >
              <img
                className="min-w-5 h-5"
                src={assets.person_tick_icon}
                alt="View Applications"
              />
              <p className="max-sm:hidden">View Applications</p>
            </NavLink>
          </ul>
        </div>

        <div className="flex-1 bg-gray-50 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
