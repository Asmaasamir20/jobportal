import { useContext, useEffect, useState, useMemo } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import ConfirmationModal from "../components/ConfirmationModal";

/**
 * AdminManageJobs Component
 * Admin page to manage all jobs in the system
 * Allows deleting jobs and toggling visibility
 */
const AdminManageJobs = () => {
  const { jobs, setJobs } = useContext(AppContext);
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    jobId: null,
  });

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // 'all', 'visible', 'hidden'
  const [sortBy, setSortBy] = useState("date"); // 'date', 'title', 'applicants'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // جلب البيانات من LocalStorage
    const appsLS = JSON.parse(localStorage.getItem("userApplications") || "[]");
    const companiesLS = JSON.parse(localStorage.getItem("companies") || "[]");

    setApplications(appsLS);
    setCompanies(companiesLS);
  };

  const getCompanyName = (companyEmail) => {
    const company = companies.find(c => c.email === companyEmail);
    return company ? company.name : 'Unknown';
  };

  const getApplicantsCount = (jobId) => {
    return applications.filter((app) => app.jobId === jobId).length;
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, jobId: id });
  };

  const deleteJob = () => {
    if (confirmModal.jobId) {
      const updatedJobs = jobs.filter(job => job.id !== confirmModal.jobId);
      setJobs(updatedJobs);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
      toast.success("Job deleted successfully!");
      setConfirmModal({ isOpen: false, jobId: null });
    }
  };

  const toggleJobVisibility = (id) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, visible: !job.visible } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    toast.success("Job visibility updated!");
  };

  // Statistics
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const visibleJobs = jobs.filter(job => job.visible !== false).length;
    const hiddenJobs = totalJobs - visibleJobs;
    const totalApplicants = applications.length;
    const avgApplicantsPerJob = totalJobs > 0 ? (totalApplicants / totalJobs).toFixed(1) : 0;

    return {
      totalJobs,
      visibleJobs,
      hiddenJobs,
      totalApplicants,
      avgApplicantsPerJob,
    };
  }, [jobs, applications]);

  // Filtered and sorted jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCompanyName(job.companyEmail)?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "" || job.category === selectedCategory;

      // Location filter
      const matchesLocation =
        selectedLocation === "" || job.location === selectedLocation;

      // Visibility filter
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && job.visible !== false) ||
        (visibilityFilter === "hidden" && job.visible === false);

      return matchesSearch && matchesCategory && matchesLocation && matchesVisibility;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = (a.title || "").localeCompare(b.title || "");
          break;
        case "applicants":
          comparison = getApplicantsCount(a.id) - getApplicantsCount(b.id);
          break;
        case "date":
        default:
          comparison = (a.date || 0) - (b.date || 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [jobs, searchQuery, selectedCategory, selectedLocation, visibilityFilter, sortBy, sortOrder, companies, applications]);

  // Pagination
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedJobs, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLocation("");
    setVisibilityFilter("all");
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation || visibilityFilter !== "all";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Jobs Management</h2>
        <p className="text-gray-600">Manage and monitor all job postings in the system</p>
      </div>

      {/* Statistics Cards - Enhanced Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-700">Visible Jobs</p>
            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700">{stats.visibleJobs}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-700">Hidden Jobs</p>
            <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-700">{stats.hiddenJobs}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-700">Total Applicants</p>
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-700">{stats.totalApplicants}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-700">Avg. Applicants</p>
            <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-700">{stats.avgApplicantsPerJob}</p>
        </div>
      </div>

      {/* Search and Filters - Enhanced Design */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
            >
              <option value="">All Categories</option>
              {JobCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
            >
              <option value="">All Locations</option>
              {JobLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Visibility Filter */}
          <div className="relative">
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Jobs</option>
              <option value="visible">Visible Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort and Clear Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-5 pt-5 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer pr-8"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="applicants">Applicants</option>
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
              className={`px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200 ${
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
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}

          <div className="ml-auto text-sm font-medium text-gray-600">
            Showing <span className="text-blue-600 font-semibold">{filteredAndSortedJobs.length}</span> of <span className="text-gray-900 font-semibold">{jobs.length}</span> jobs
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full bg-white max-sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">#</th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Job Title</th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">Company</th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">Date</th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">Location</th>
              <th className="py-3 px-4 border-b text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Applicants</th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Visible</th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {jobs.length === 0 ? "No jobs found" : "No jobs match your filters"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {jobs.length === 0 
                        ? "Start by adding jobs to the system" 
                        : "Try adjusting your search criteria or filters"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job, index) => (
                <tr 
                  key={job.id} 
                  className="text-gray-700 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100"
                >
                  <td className="py-3 px-4 max-sm:hidden text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">{job.title}</div>
                    {job.category && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                        {job.category}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 max-sm:hidden">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {getCompanyName(job.companyEmail)?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-gray-700">{getCompanyName(job.companyEmail)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-sm:hidden text-gray-600 text-sm">
                    {moment(job.date).format("MMM DD, YYYY")}
                  </td>
                  <td className="py-3 px-4 max-sm:hidden">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      getApplicantsCount(job.id) > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                    {getApplicantsCount(job.id)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!job.visible}
                      onChange={() => toggleJobVisibility(job.id)}
                        className="sr-only peer"
                    />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteClick(job.id)}
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
        onClose={() => setConfirmModal({ isOpen: false, jobId: null })}
        onConfirm={deleteJob}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminManageJobs;

