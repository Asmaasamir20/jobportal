import React from "react";
import { assets } from "../assets/assets";

/**
 * EmptyState Component
 * Displays a message when no jobs are found
 * Provides better UX than just showing "No jobs found"
 */
const EmptyState = ({ 
  title = "No jobs found", 
  description = "Try searching with different keywords or adjust the filters",
  showResetButton = false,
  onReset = () => {}
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon or Illustration */}
      <div className="mb-6">
        <svg
          className="w-24 h-24 text-gray-400 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 max-w-md mb-6">{description}</p>

      {/* Reset Button (optional) */}
      {showResetButton && (
        <button
          onClick={onReset}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;

