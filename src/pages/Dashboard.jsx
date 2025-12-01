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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

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
      // Close sidebar when clicking outside on mobile
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("[data-sidebar-toggle]")
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isDropdownOpen || isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar for Recruiter Panel - Enhanced Design */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              data-sidebar-toggle
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <img
              onClick={() => navigate("/dashboard/manage-jobs")}
              className="h-8 sm:h-auto max-w-[100px] sm:max-w-[140px] cursor-pointer hover:opacity-80 transition-opacity"
              src={assets.logo}
              alt="Logo"
            />
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <h1 className="hidden md:block text-lg lg:text-xl xl:text-2xl font-bold text-gray-800">
              Recruiter Dashboard
            </h1>
          </div>
          {companyData && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-lg">
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
                <p className="text-sm sm:text-base font-semibold text-blue-700">
                  Welcome,{" "}
                  <span className="hidden lg:inline">{companyData.name}</span>
                </p>
              </div>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all overflow-hidden border-2 border-gray-200"
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
                      <p className="text-base font-bold text-gray-900">
                        {companyData.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {companyData.email}
                      </p>
                    </div>
                    <ul className="list-none m-0">
                      <li
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="py-2.5 px-4 cursor-pointer hover:bg-red-50 text-red-600 text-base font-semibold transition-colors flex items-center gap-2"
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

      <div className="flex items-start relative flex-1">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Enhanced Design */}
        <div
          ref={sidebarRef}
          className={`fixed md:static top-0 left-0 h-full md:h-full z-50 md:z-auto border-r-2 bg-gray-50 w-64 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } md:inline-block`}
        >
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <NavLink
              onClick={() => setIsSidebarOpen(false)}
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
              <p className="text-base sm:text-lg font-medium">Add Job</p>
            </NavLink>

            <NavLink
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-3 w-full transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-semibold shadow-sm"
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
              <p className="text-base sm:text-lg font-medium">Manage Jobs</p>
            </NavLink>

            <NavLink
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-3 w-full transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-semibold shadow-sm"
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
              <p className="text-base sm:text-lg font-medium">
                View Applications
              </p>
            </NavLink>
          </ul>
        </div>

        <div className="flex-1 bg-gray-50 min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
