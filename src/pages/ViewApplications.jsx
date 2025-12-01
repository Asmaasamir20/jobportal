import React, { useState, useEffect, useMemo } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import moment from "moment";

/**
 * ViewApplications Component
 * Professional applications management page for recruiters
 * Features: Statistics, filters, search, and enhanced UI
 */
const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [companyData, setCompanyData] = useState(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'accepted', 'rejected'
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load data from localStorage
   */
  const loadData = () => {
    const appsLS = JSON.parse(localStorage.getItem("userApplications") || "[]");
    const jobsLS = JSON.parse(localStorage.getItem("jobs") || "[]");
    const usersLS = JSON.parse(localStorage.getItem("userData") || "null");
    const companyLS = JSON.parse(localStorage.getItem("companyData") || "null");

    setApplications(appsLS);
    setJobs(jobsLS);
    setUsers(Array.isArray(usersLS) ? usersLS : usersLS ? [usersLS] : []);
    setCompanyData(companyLS);
  };

  /**
   * Get job details by jobId
   */
  const getJobDetails = (jobId) => {
    return jobs.find((job) => job.id === jobId) || null;
  };

  /**
   * Get user details by userId
   */
  const getUserDetails = (userId) => {
    if (Array.isArray(users)) {
      return users.find((user) => user.clerkId === userId) || null;
    }
    return users?.clerkId === userId ? users : null;
  };

  /**
   * Get applications for current company's jobs only
   */
  const companyApplications = useMemo(() => {
    if (!companyData) return [];
    return applications.filter((app) => {
      const job = getJobDetails(app.jobId);
      return job && job.companyEmail === companyData.email;
    });
  }, [applications, jobs, companyData]);

  /**
   * Handle accept application
   */
  const handleAccept = (applicationId) => {
    const updatedApplications = applications.map((app) =>
      app.jobId === applicationId && app.userId
        ? { ...app, status: "accepted", reviewedAt: new Date().toISOString() }
        : app
    );
    setApplications(updatedApplications);
    localStorage.setItem(
      "userApplications",
      JSON.stringify(updatedApplications)
    );

    const app = companyApplications.find((a) => a.jobId === applicationId);
    const user = getUserDetails(app?.userId);
    toast.success(
      `Application from ${user?.name || "User"} accepted successfully!`
    );
    loadData();
  };

  /**
   * Handle reject application
   */
  const handleReject = (applicationId) => {
    const updatedApplications = applications.map((app) =>
      app.jobId === applicationId && app.userId
        ? { ...app, status: "rejected", reviewedAt: new Date().toISOString() }
        : app
    );
    setApplications(updatedApplications);
    localStorage.setItem(
      "userApplications",
      JSON.stringify(updatedApplications)
    );

    const app = companyApplications.find((a) => a.jobId === applicationId);
    const user = getUserDetails(app?.userId);
    toast.error(`Application from ${user?.name || "User"} rejected.`);
    loadData();
  };

  /**
   * Calculate statistics
   */
  const stats = useMemo(() => {
    const total = companyApplications.length;
    const pending = companyApplications.filter(
      (app) => !app.status || app.status === "pending"
    ).length;
    const accepted = companyApplications.filter(
      (app) => app.status === "accepted"
    ).length;
    const rejected = companyApplications.filter(
      (app) => app.status === "rejected"
    ).length;

    return { total, pending, accepted, rejected };
  }, [companyApplications]);

  /**
   * Filter and sort applications
   */
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = companyApplications.filter((app) => {
      const user = getUserDetails(app.userId);
      const job = getJobDetails(app.jobId);
      const userName = user?.name || "Unknown";
      const jobTitle = job?.title || "Unknown Job";

      const matchesSearch =
        searchQuery === "" ||
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" &&
          (!app.status || app.status === "pending")) ||
        app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          const userA = getUserDetails(a.userId);
          const userB = getUserDetails(b.userId);
          comparison = (userA?.name || "").localeCompare(userB?.name || "");
          break;
        case "date":
        default:
          comparison = new Date(a.appliedAt || 0) - new Date(b.appliedAt || 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    companyApplications,
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    users,
    jobs,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("date");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all";

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          View Applications
        </h2>
        <p className="text-gray-600">
          Review and manage job applications from candidates
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">
              Total Applications
            </p>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-yellow-700">Pending</p>
            <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-700">Accepted</p>
            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700">{stats.accepted}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-red-700">Rejected</p>
            <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by candidate name or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort and Clear Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-5 pt-5 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer pr-8"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              type="button"
              className={`px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200 ${
                sortOrder === "asc"
                  ? "bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </button>
          )}

          <div className="ml-auto text-sm font-medium text-gray-600">
            Showing{" "}
            <span className="text-blue-600 font-semibold">
              {filteredAndSortedApplications.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-900 font-semibold">
              {companyApplications.length}
            </span>{" "}
            applications
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full bg-white max-sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">
                #
              </th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Candidate
              </th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">
                Job Title
              </th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">
                Applied Date
              </th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedApplications.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {companyApplications.length === 0
                        ? "No applications yet"
                        : "No applications match your filters"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {companyApplications.length === 0
                        ? "Applications will appear here when candidates apply to your jobs"
                        : "Try adjusting your search criteria or filters"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mt-4"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedApplications.map((app, index) => {
                const user = getUserDetails(app.userId);
                const job = getJobDetails(app.jobId);
                const status = app.status || "pending";

                return (
                  <tr
                    key={`${app.jobId}-${app.userId}`}
                    className="text-gray-700 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100"
                  >
                    <td className="py-3 px-4 max-sm:hidden text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user?.name || "Unknown User"}
                          </div>
                          {user?.email && (
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-sm:hidden">
                      <div className="font-medium text-gray-900">
                        {job?.title || "Unknown Job"}
                      </div>
                      {job?.location && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          {job.location}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 max-sm:hidden text-gray-600 text-sm">
                      {app.appliedAt
                        ? moment(app.appliedAt).format("MMM DD, YYYY")
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {status === "accepted"
                          ? "Accepted"
                          : status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(app.jobId)}
                            className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-100 hover:text-green-700 transition-all duration-200"
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(app.jobId)}
                            className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 hover:text-red-700 transition-all duration-200"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {status === "accepted" ? "✓ Accepted" : "✗ Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
