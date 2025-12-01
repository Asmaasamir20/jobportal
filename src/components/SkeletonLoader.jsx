import React from "react";

/**
 * SkeletonLoader Component
 * Professional skeleton loading for jobs with shimmer effect
 * Mimics JobCard shape while waiting for data
 */
const SkeletonLoader = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="border border-gray-200 p-3 sm:p-4 shadow-sm rounded-xl bg-white animate-pulse"
          role="status"
          aria-label="Loading..."
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Company Logo and Info Skeleton */}
          <div className="flex justify-between items-start mb-3 sm:mb-4 h-[3.5rem] sm:h-[3.75rem]">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 sm:w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 sm:w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-20 sm:w-24 bg-gray-200 rounded-full"></div>
          </div>

          {/* Title Skeleton */}
          <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded mb-2 sm:mb-3"></div>
          <div className="h-5 sm:h-6 w-1/2 bg-gray-200 rounded mb-3 sm:mb-4"></div>

          {/* Tags Skeleton */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-2 sm:mb-3 min-h-[2.5rem] sm:min-h-[2.75rem]">
            <div className="h-7 w-20 sm:w-24 bg-gray-200 rounded-full"></div>
            <div className="h-7 w-24 sm:w-28 bg-gray-200 rounded-full"></div>
            <div className="h-7 w-20 sm:w-24 bg-gray-200 rounded-full"></div>
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2 my-3 sm:my-4">
            <div className="h-3 sm:h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-3 sm:h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-3 sm:h-4 w-4/6 bg-gray-200 rounded"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="mt-auto pt-4 border-t border-gray-200 flex gap-2 sm:gap-3">
            <div className="h-9 sm:h-10 flex-1 bg-gray-200 rounded-lg"></div>
            <div className="h-9 sm:h-10 w-24 sm:w-28 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;

