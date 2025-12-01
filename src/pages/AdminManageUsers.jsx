import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import ConfirmationModal from "../components/ConfirmationModal";

/**
 * AdminManageUsers Component
 * Admin page to manage all users (Job Seekers and Companies)
 * Allows viewing user information and deleting companies
 */
const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState('jobseekers'); // 'jobseekers' or 'companies'
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    companyEmail: null,
  });

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name', 'email', 'applications', 'jobs'
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Job Seekers from Clerk (stored in localStorage)
    // في حالة استخدام Clerk، قد يكون هناك عدة مستخدمين
    // هنا نجمع كل البيانات المخزنة
    const allUsers = [];
    
    // محاولة جلب بيانات المستخدم الحالي
    const userDataLS = localStorage.getItem("userData");
    if (userDataLS) {
      try {
        const userData = JSON.parse(userDataLS);
        if (userData.clerkId) {
          allUsers.push(userData);
        }
      } catch (e) {
        console.error("Error parsing userData:", e);
      }
    }
    
    // Companies
    const companiesLS = JSON.parse(localStorage.getItem("companies") || "[]");
    
    setUsers(allUsers);
    setCompanies(companiesLS);
  };

  const handleDeleteClick = (email) => {
    setConfirmModal({ isOpen: true, companyEmail: email });
  };

  const deleteCompany = () => {
    if (confirmModal.companyEmail) {
      const email = confirmModal.companyEmail;
      
      // حذف الشركة
      const updatedCompanies = companies.filter(c => c.email !== email);
      setCompanies(updatedCompanies);
      localStorage.setItem("companies", JSON.stringify(updatedCompanies));

      // حذف جميع الوظائف التابعة لهذه الشركة
      const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const updatedJobs = jobs.filter(job => job.companyEmail !== email);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));

      toast.success("Company and related jobs deleted successfully!");
      loadData(); // إعادة تحميل البيانات
      setConfirmModal({ isOpen: false, companyEmail: null });
    }
  };

  const getApplicationsCount = (userId) => {
    const applications = JSON.parse(localStorage.getItem("userApplications") || "[]");
    return applications.filter(app => app.userId === userId).length;
  };

  const getJobsCount = (companyEmail) => {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    return jobs.filter(job => job.companyEmail === companyEmail).length;
  };

  // Statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalCompanies = companies.length;
    const totalApplications = JSON.parse(localStorage.getItem("userApplications") || "[]").length;
    const totalJobs = JSON.parse(localStorage.getItem("jobs") || "[]").length;
    const totalJobsByCompanies = companies.reduce((sum, company) => sum + getJobsCount(company.email), 0);

    return {
      totalUsers,
      totalCompanies,
      totalApplications,
      totalJobs,
      totalJobsByCompanies,
    };
  }, [users, companies]);

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    const data = activeTab === 'jobseekers' ? users : companies;
    
    let filtered = data.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "");
          break;
        case "email":
          comparison = (a.email || "").localeCompare(b.email || "");
          break;
        case "applications":
          if (activeTab === 'jobseekers') {
            const appsA = getApplicationsCount(a.clerkId);
            const appsB = getApplicationsCount(b.clerkId);
            comparison = appsA - appsB;
          } else {
            comparison = 0;
          }
          break;
        case "jobs":
          if (activeTab === 'companies') {
            const jobsA = getJobsCount(a.email);
            const jobsB = getJobsCount(b.email);
            comparison = jobsA - jobsB;
          } else {
            comparison = 0;
          }
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [users, companies, activeTab, searchQuery, sortBy, sortOrder]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy(activeTab === 'jobseekers' ? "name" : "name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== "";

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
  }, [activeTab]);

  return (
    <div className="px-5 py-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Users Management</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage job seekers and companies registered on the platform</p>
      </div>

      {/* Statistics Cards - Enhanced Design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-blue-700">Total Companies</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700">{stats.totalCompanies}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-green-700">Total Applications</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">{stats.totalApplications}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-purple-700">Total Jobs</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-700">{stats.totalJobs}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-orange-700">Company Jobs</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-700">{stats.totalJobsByCompanies}</p>
        </div>
      </div>

      {/* Search and Filters - Enhanced Design */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* First Row: Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'jobseekers' ? 'job seekers' : 'companies'}...`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                    type="button"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap hidden sm:block">Sort by:</label>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer pr-8 w-full sm:w-auto"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  {activeTab === 'jobseekers' ? (
                    <option value="applications">Applications</option>
                  ) : (
                    <option value="jobs">Jobs Posted</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
                type="button"
                className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                  sortOrder === "asc"
                    ? "bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                title={sortOrder === "asc" ? "Ascending" : "Descending"}
                aria-label={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                type="button"
                className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200 whitespace-nowrap flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 text-sm font-medium text-gray-600 text-center sm:text-left">
            Showing <span className="text-blue-600 font-semibold">{filteredAndSortedData.length}</span> of <span className="text-gray-900 font-semibold">{activeTab === 'jobseekers' ? users.length : companies.length}</span> {activeTab === 'jobseekers' ? 'users' : 'companies'}
          </div>
        </div>
      </div>

      {/* Tabs - Enhanced Design */}
      <div className="flex gap-2 mb-6 bg-white border border-gray-200 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
        <button
          onClick={() => setActiveTab('jobseekers')}
          type="button"
          className={`px-4 sm:px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'jobseekers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="hidden sm:inline">Job Seekers</span>
            <span className="sm:hidden">Users</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'jobseekers'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {users.length}
            </span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          type="button"
          className={`px-4 sm:px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'companies'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Companies
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'companies'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {companies.length}
            </span>
          </span>
        </button>
      </div>

      {/* Job Seekers Table */}
      {activeTab === 'jobseekers' && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full bg-white max-sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">Email</th>
                <th className="py-3 px-4 border-b text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Applications</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {users.length === 0 ? "No job seekers found" : "No job seekers match your search"}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {users.length === 0 
                          ? "No users have registered yet" 
                          : "Try adjusting your search criteria"}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((user, index) => (
                  <tr 
                    key={user.clerkId || index} 
                    className="text-gray-700 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100"
                  >
                    <td className="py-3 px-4 text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 object-cover"
                            src={user.image || assets.company_icon}
                            alt={user.name}
                            onError={(e) => {
                              e.target.src = assets.company_icon;
                            }}
                          />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">{user.name || 'N/A'}</div>
                          {user.email && (
                            <div className="text-xs text-gray-500 sm:hidden truncate">{user.email}</div>
                          )}
                          {user.clerkId && (
                            <div className="text-xs text-gray-500 hidden sm:block">ID: {user.clerkId.slice(0, 8)}...</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-sm:hidden">
                      <span className="text-gray-700">{user.email || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        getApplicationsCount(user.clerkId) > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getApplicationsCount(user.clerkId)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Companies Table */}
      {activeTab === 'companies' && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full bg-white max-sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company Name</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">Email</th>
                <th className="py-3 px-4 border-b text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Jobs Posted</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {companies.length === 0 ? "No companies found" : "No companies match your search"}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {companies.length === 0 
                          ? "No companies have registered yet" 
                          : "Try adjusting your search criteria"}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((company, index) => (
                  <tr 
                    key={company.email} 
                    className="text-gray-700 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100"
                  >
                    <td className="py-3 px-4 text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 object-cover"
                            src={company.image || assets.company_icon}
                            alt={company.name}
                            onError={(e) => {
                              e.target.src = assets.company_icon;
                            }}
                          />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">{company.name}</div>
                          {company.email && (
                            <div className="text-xs text-gray-500 sm:hidden truncate">{company.email}</div>
                          )}
                          <div className="text-xs text-gray-500 hidden sm:block">Company</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-sm:hidden">
                      <span className="text-gray-700">{company.email}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        getJobsCount(company.email) > 0 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getJobsCount(company.email)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeleteClick(company.email)}
                        className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination - Enhanced Design */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border font-medium transition-all duration-200 ${
              currentPage === 1
                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="px-2 text-gray-400">...</span>;
            }
            return null;
          })}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border font-medium transition-all duration-200 ${
              currentPage === totalPages
                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            <span className="flex items-center gap-1">
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          
          <div className="ml-4 text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, companyEmail: null })}
        onConfirm={deleteCompany}
        title="Delete Company"
        message="Are you sure you want to delete this company? This will also delete all jobs posted by this company. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminManageUsers;

