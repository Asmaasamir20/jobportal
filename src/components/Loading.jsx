import React from "react";

/**
 * Loading Component
 * Professional loading spinner with modern design
 * Enhanced with better animations and visual feedback
 */
const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="flex flex-col items-center gap-4">
        {/* Main Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-4 border-r-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        
        {/* Loading Text */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium text-sm sm:text-base">Loading</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
