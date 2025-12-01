import { useState } from "react";
import PropTypes from "prop-types";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "react-toastify";

/**
 * JobCard Component
 * Job card with animations and hover effects
 * Enhanced and responsive design
 */
const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [isHovered, setIsHovered] = useState(false);

  // التحقق من وجود job قبل عرض المكون
  if (!job || !job.id) {
    console.warn("JobCard: Missing job data or job ID");
    return null;
  }

  // Format date to readable format
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  /**
   * Handle navigation to job application page
   * Validates job ID and user authentication before navigation
   */
  const handleApply = () => {
    // التحقق من تسجيل الدخول
    if (!user) {
      toast.info("يرجى تسجيل الدخول أولاً للتقديم على الوظيفة");
      openSignIn();
      return;
    }

    // التحقق من وجود job و job.id قبل التنقل
    if (!job || !job.id) {
      console.error("Job or job ID is missing");
      return;
    }

    try {
      // التحقق من أن job.id هو رقم صحيح
      const jobId = Number(job.id);
      if (isNaN(jobId)) {
        console.error("Invalid job ID:", job.id);
        return;
      }

      navigate(`/apply-job/${jobId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error navigating to job page:", error);
    }
  };

  /**
   * Handle navigation to job details page
   * Navigates to job details page without authentication requirement
   */
  const handleLearnMore = () => {
    if (!job || !job.id) {
      console.error("Job or job ID is missing");
      return;
    }

    try {
      const jobId = Number(job.id);
      if (isNaN(jobId)) {
        console.error("Invalid job ID:", job.id);
        return;
      }

      navigate(`/job-details/${jobId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error navigating to job details page:", error);
    }
  };

  return (
    <div
      className="group border border-gray-200 p-3 sm:p-4 shadow-sm rounded-xl bg-white hover:shadow-xl hover:border-blue-400/50 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/30 group-hover:to-indigo-50/20 transition-all duration-300 rounded-xl pointer-events-none"></div>
      {/* Company Logo and Info - Fixed height */}
      <div className="relative z-10 flex justify-between items-start mb-3 sm:mb-4 h-[3.5rem] sm:h-[3.75rem]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300">
            {job.companyImage && !job.companyImage.startsWith("blob:") ? (
              <img
                className="h-full w-full object-contain p-2"
                src={job.companyImage}
                alt={job.companyName || "Company Logo"}
                onError={(e) => {
                  e.target.src = assets.company_icon;
                }}
              />
            ) : (
              <img
                className="h-8 w-8 opacity-50"
                src={assets.company_icon}
                alt="Company"
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-xs sm:text-sm text-gray-700">
              {job.companyName || "Company"}
            </p>
            {job.date && (
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                {formatDate(job.date)}
              </p>
            )}
          </div>
        </div>
        {job.category && (
          <span className="text-[10px] sm:text-xs bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 px-2 py-1 rounded-full font-semibold flex-shrink-0 border border-purple-200/50 shadow-sm">
            {job.category}
          </span>
        )}
      </div>

      {/* Job Title - Fixed height */}
      <h4 className="relative z-10 font-bold text-base sm:text-lg lg:text-xl text-gray-900  line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 h-[3rem] sm:h-[3.5rem]">
        {job.title}
      </h4>

      {/* Location and Level Tags - Allow wrapping without overflow */}
      <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 flex-wrap mb-2 sm:mb-3 min-h-[2.5rem] sm:min-h-[2.75rem] py-1.5">
        {job.location && (
          <span className="inline-flex items-center gap-1.5 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 px-2.5 py-1 rounded-full text-sm  text-blue-700 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-100">
            <img
              src={assets.location_icon}
              alt="Location"
              className="h-3 w-3 sm:h-3.5 sm:w-3.5"
            />
            {job.location}
          </span>
        )}
        {job.level && (
          <span className="inline-flex items-center gap-1.5 bg-red-50/80 backdrop-blur-sm border border-red-200/60 px-2.5 py-1 rounded-full text-sm  text-red-700 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-red-100">
            <img
              src={assets.suitcase_icon}
              alt="Level"
              className="h-3 w-3 sm:h-3.5 sm:w-3.5"
            />
            {job.level}
          </span>
        )}
        {job.salary && (
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 px-2.5 py-1 rounded-full text-sm text-green-700 shadow-sm hover:shadow-md transition-all duration-200 hover:from-green-100 hover:to-emerald-100">
            <img
              src={assets.money_icon}
              alt="Salary"
              className="h-3 w-3 sm:h-3.5 sm:w-3.5"
            />
            ${job.salary.toLocaleString()}
          </span>
        )}
      </div>

      {/* Job Description Preview - Fixed height and position - This ensures all descriptions start at the same level */}
      <div className="relative z-10 flex-1 my-3 sm:my-4">
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-200">
          {job.description
            ? stripHtml(job.description).slice(0, 120) + "..."
            : "No description available"}
        </p>
      </div>

      {/* Action Buttons - Always at bottom - Enhanced Professional Design */}
      <div className="relative z-10 mt-auto pt-4 border-t border-gray-200/60 group-hover:border-gray-300 transition-colors duration-300 flex gap-2 sm:gap-3">
        <button
          onClick={handleApply}
          className={`group flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-500/30 relative overflow-hidden ${
            isHovered
              ? "transform scale-[1.02] shadow-lg shadow-blue-500/40"
              : "hover:scale-[1.02]"
          }`}
          type="button"
        >
          <span className="relative z-10 flex items-center justify-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Apply now
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <button
          onClick={handleLearnMore}
          className={`group px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm border-2 transition-all duration-300 relative overflow-hidden ${
            isHovered
              ? "border-blue-600 text-blue-600 bg-blue-50/80 shadow-md transform scale-[1.02]"
              : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-sm"
          }`}
          type="button"
        >
          <span className="relative z-10 flex items-center justify-center gap-1.5">
            Learn more
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

/**
 * PropTypes validation for JobCard component
 * Ensures all required job properties are provided with correct types
 */
JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    companyName: PropTypes.string,
    companyImage: PropTypes.string,
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    category: PropTypes.string,
    location: PropTypes.string,
    level: PropTypes.string,
    salary: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
};

export default JobCard;
