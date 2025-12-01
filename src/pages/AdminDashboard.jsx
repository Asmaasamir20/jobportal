import { useContext, useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

/**
 * AdminDashboard Component
 * Main dashboard layout for admin panel
 * Matches the design pattern of Dashboard (Recruiter Panel)
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminData, setAdminData, setAdminToken } = useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to logout admin
  const logout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    setAdminData(null);
    navigate('/');
  };

  // Redirect to manage-jobs only if on the base admin dashboard route
  useEffect(() => {
    if (adminData && location.pathname === '/admin/dashboard') {
      navigate('/admin/dashboard/manage-jobs', { replace: true });
    }
  }, [adminData, location.pathname, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="min-h-screen">
      {/* Navbar for Admin Panel - Enhanced Design */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              onClick={() => navigate('/')} 
              className="max-sm:w-32 cursor-pointer hover:opacity-80 transition-opacity" 
              src={assets.logo} 
              alt="Logo" 
            />
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <h1 className="hidden md:block text-lg font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
          {adminData && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className='text-sm font-medium text-blue-700'>Welcome, {adminData.name}</p>
              </div>
              <div className="relative" ref={dropdownRef}> 
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                >
                  <span className="text-white font-semibold text-sm">
                    {adminData.name?.charAt(0) || 'A'}
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 z-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{adminData.name}</p>
                      <p className="text-xs text-gray-500">{adminData.email}</p>
                    </div>
                    <ul className="list-none m-0">
                      <li 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }} 
                        className="py-2.5 px-4 cursor-pointer hover:bg-red-50 text-red-600 text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
              className={({isActive})=> `flex items-center p-3 sm:px-6 gap-3 w-full transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`} 
              to={'/admin/dashboard/manage-jobs'}
            >
              <img className="min-w-5 h-5" src={assets.home_icon} alt="Manage Jobs" />
              <p className='max-sm:hidden'>Manage Jobs</p>
            </NavLink> 

            <NavLink 
              className={({isActive})=> `flex items-center p-3 sm:px-6 gap-3 w-full transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`} 
              to={'/admin/dashboard/manage-users'}
            >
              <img className="min-w-5 h-5" src={assets.person_icon} alt="Manage Users" />
              <p className='max-sm:hidden'>Manage Users</p>
            </NavLink>
          </ul>
        </div>

        <div className="flex-1 bg-gray-50 min-h-screen">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

