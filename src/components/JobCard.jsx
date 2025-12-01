import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

/**
 * JobCard Component
 * Job card with animations and hover effects
 * Enhanced and responsive design
 */
const JobCard = ({ job }) => {
  const navigate = useNavigate();
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
   * Validates job ID before navigation to prevent errors
   */
  const handleApply = () => {
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

  return (
    <div
      className="border border-gray-200 p-6 shadow-sm rounded-lg bg-white hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Company Logo and Info */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            {job.companyImage ? (
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
            <p className="font-medium text-sm text-gray-700">
              {job.companyName || "Company"}
            </p>
            {job.date && (
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(job.date)}
              </p>
            )}
          </div>
        </div>
        {job.category && (
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-medium">
            {job.category}
          </span>
        )}
      </div>

      {/* Job Title */}
      <h4 className="font-semibold text-lg sm:text-xl text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
        {job.title}
      </h4>

      {/* Location and Level Tags */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {job.location && (
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-blue-700">
            <img
              src={assets.location_icon}
              alt="Location"
              className="h-3 w-3 sm:h-4 sm:w-4"
            />
            {job.location}
          </span>
        )}
        {job.level && (
          <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-red-700">
            <img
              src={assets.suitcase_icon}
              alt="Level"
              className="h-3 w-3 sm:h-4 sm:w-4"
            />
            {job.level}
          </span>
        )}
        {job.salary && (
          <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-green-700">
            <img
              src={assets.money_icon}
              alt="Salary"
              className="h-3 w-3 sm:h-4 sm:w-4"
            />
            ${job.salary.toLocaleString()}
          </span>
        )}
      </div>

      {/* Job Description Preview */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
        {job.description
          ? stripHtml(job.description).slice(0, 120) + "..."
          : "No description available"}
      </p>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleApply}
          className={`flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
            isHovered
              ? "bg-blue-700 shadow-md transform scale-105"
              : "hover:bg-blue-700 hover:shadow-sm"
          }`}
          type="button"
        >
          Apply now
        </button>

        <button
          onClick={handleApply}
          className={`px-4 py-2.5 rounded-lg font-medium text-sm border transition-all duration-200 ${
            isHovered
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
          }`}
          type="button"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;
