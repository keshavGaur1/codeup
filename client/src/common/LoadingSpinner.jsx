import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="relative">
        {/* Spinner Circle */}
        <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-teal rounded-full animate-pulse"></div>
        </div>
      </div>
      <span className="ml-4 text-octonary text-lg font-medium animate-pulse">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;