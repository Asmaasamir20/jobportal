import React from "react";

/**
 * SkeletonLoader Component
 * Displays skeleton loading for jobs during loading
 * Mimics JobCard shape while waiting for data
 */
const SkeletonLoader = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="border p-6 shadow rounded animate-pulse"
          role="status"
          aria-label="Loading..."
        >
          {/* Company Logo Skeleton */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>

          {/* Title Skeleton */}
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-3"></div>

          {/* Tags Skeleton */}
          <div className="flex items-center gap-3 mt-2 mb-4">
            <div className="h-6 w-20 bg-gray-300 rounded"></div>
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2 mt-4">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="mt-4 flex gap-4">
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;

