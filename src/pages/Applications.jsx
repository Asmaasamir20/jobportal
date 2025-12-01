import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useUser } from "@clerk/clerk-react";
import moment from "moment";
import { toast } from "react-toastify";
import kconvert from "k-convert";

/**
 * Applications Component
 * Displays user's job applications with modern design and filtering capabilities
 * Shows resume management and application statistics
 */
const Applications = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { userApplications, jobs, userData, setUserData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, accepted, rejected
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, company

  /**
   * Load resume from userData on component mount
   * Resume is stored in userData.resume as filename
   */
  useEffect(() => {
    if (userData?.resume) {
      setResume({ name: userData.resume });
    }
  }, [userData]);

  /**
   * Save resume file to userData
   * Updates localStorage and context state
   */
  const saveResume = (file) => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ["application/pdf", ".pdf", ".doc", ".docx"];
    const fileType = file.type || file.name.split(".").pop().toLowerCase();
    
    if (!allowedTypes.some(type => fileType.includes(type))) {
      toast.error("Please upload a PDF, DOC, or DOCX file");
      return;
    }

    // Update userData with resume filename
    const updatedUser = { ...userData, resume: file.name };
    setUserData(updatedUser);
    setResume(file);
    setIsEdit(false);
    toast.success("Resume uploaded successfully!");
  };

  /**
   * Get applications with full job details
   * Merges userApplications with jobs data to show complete information
   */
  const applicationsWithJobs = useMemo(() => {
    if (!userApplications || !Array.isArray(userApplications) || !jobs || !Array.isArray(jobs)) {
      return [];
    }

    // Get current user's clerkId
    const currentUserId = user?.id || null;
    if (!currentUserId) return [];

    // Filter applications for current user
    const userApps = userApplications.filter(
      (app) => app.userId === currentUserId
    );

    // Map applications with job details
    return userApps
      .map((app) => {
        // Find matching job - support both string and number IDs
        const jobId = app.jobId;
        const job = jobs.find((j) => {
          if (!j || j.id === undefined || j.id === null) return false;
          return String(j.id) === String(jobId) || Number(j.id) === Number(jobId);
        });

        if (!job) return null;

        return {
          ...app,
          job: job,
          status: app.status || "Pending", // Default to Pending if no status
        };
      })
      .filter((app) => app !== null);
  }, [userApplications, jobs, user?.id]);

  /**
   * Filter applications by status
   */
  const filteredApplications = useMemo(() => {
    let filtered = [...applicationsWithJobs];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => {
        const status = app.status?.toLowerCase() || "pending";
        return status === statusFilter.toLowerCase();
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.appliedAt || 0);
      const dateB = new Date(b.appliedAt || 0);

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "company":
          return (a.job?.companyName || "").localeCompare(b.job?.companyName || "");
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  }, [applicationsWithJobs, statusFilter, sortBy]);

  /**
   * Calculate application statistics
   */
  const stats = useMemo(() => {
    const total = applicationsWithJobs.length;
    const pending = applicationsWithJobs.filter(
      (app) => (app.status?.toLowerCase() || "pending") === "pending"
    ).length;
    const accepted = applicationsWithJobs.filter(
      (app) => app.status?.toLowerCase() === "accepted"
    ).length;
    const rejected = applicationsWithJobs.filter(
      (app) => app.status?.toLowerCase() === "rejected"
    ).length;

    return { total, pending, accepted, rejected };
  }, [applicationsWithJobs]);

  /**
   * Navigate to job details page
   */
  const handleViewJob = (jobId) => {
    if (!jobId) return;
    navigate(`/job-details/${jobId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Get status badge styling based on status
   */
  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    switch (statusLower) {
      case "accepted":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 font-semibold";
      case "rejected":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 font-semibold";
      default:
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 font-semibold";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="px-4 sm:px-5 py-6 sm:py-10 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              My Applications
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Manage your resume and track your job applications
            </p>
          </div>

          {/* Resume Section - Enhanced Design */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                  Your Resume
                </h2>
                <p className="text-sm text-gray-500">
                  Upload your resume to apply for jobs
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isEdit ? (
                <>
                  <label
                    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                    htmlFor="resumeUpload"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Select Resume
                    <input
                      id="resumeUpload"
                      onChange={(e) => saveResume(e.target.files[0])}
                      accept=".pdf,.doc,.docx,application/pdf"
                      type="file"
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  {resume ? (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3">
                      <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0"
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
                      <span className="text-blue-700 font-semibold truncate">
                        {resume.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-500 px-4 sm:px-6 py-2.5 sm:py-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span className="text-sm sm:text-base">No Resume Uploaded</span>
                    </div>
                  )}
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-blue-500 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    {resume ? "Change Resume" : "Upload Resume"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          {applicationsWithJobs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1">
                  {stats.total}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total Applications</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  {stats.pending}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-green-700 mb-1">
                  {stats.accepted}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Accepted</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200/50 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-red-700 mb-1">
                  {stats.rejected}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          )}

          {/* Applications Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600"
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
                  Jobs Applied
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Filters and Sort */}
              {applicationsWithJobs.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="company">By Company</option>
                  </select>
                </div>
              )}
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <EmptyState
                title={
                  applicationsWithJobs.length === 0
                    ? "No Applications Yet"
                    : "No Applications Found"
                }
                description={
                  applicationsWithJobs.length === 0
                    ? "Start applying to jobs to see your applications here"
                    : "Try adjusting your filters to see more results"
                }
                showResetButton={statusFilter !== "all"}
                onReset={() => setStatusFilter("all")}
              />
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app, index) => {
                  const job = app.job;
                  if (!job) return null;

                  return (
                    <div
                      key={app.jobId || index}
                      className="group border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => handleViewJob(job.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Company Logo */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-sm">
                            {job.companyImage && !job.companyImage.startsWith("blob:") ? (
                              <img
                                className="w-full h-full object-contain p-2"
                                src={job.companyImage}
                                alt={job.companyName || "Company"}
                                onError={(e) => {
                                  e.target.src = assets.company_icon;
                                }}
                              />
                            ) : (
                              <img
                                className="w-10 h-10 opacity-50"
                                src={assets.company_icon}
                                alt="Company"
                              />
                            )}
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-base sm:text-lg text-gray-700 font-semibold mb-2">
                                {job.companyName || "Company"}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {job.location && (
                                  <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full text-xs sm:text-sm text-blue-700">
                                    <img
                                      src={assets.location_icon}
                                      alt="Location"
                                      className="w-3.5 h-3.5"
                                    />
                                    {job.location}
                                  </span>
                                )}
                                {job.level && (
                                  <span className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full text-xs sm:text-sm text-purple-700">
                                    <img
                                      src={assets.suitcase_icon}
                                      alt="Level"
                                      className="w-3.5 h-3.5"
                                    />
                                    {job.level}
                                  </span>
                                )}
                                {job.salary && (
                                  <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full text-xs sm:text-sm text-green-700">
                                    <img
                                      src={assets.money_icon}
                                      alt="Salary"
                                      className="w-3.5 h-3.5"
                                    />
                                    {kconvert.convertTo(job.salary)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm border ${getStatusBadgeClass(
                                  app.status
                                )}`}
                              >
                                {app.status || "Pending"}
                              </span>
                              {app.appliedAt && (
                                <p className="text-xs text-gray-500">
                                  Applied {moment(app.appliedAt).fromNow()}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewJob(job.id);
                            }}
                            className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            View Details
                            <svg
                              className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
