import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

/**
 * Hero Component
 * Main hero section with search bar
 * Includes debounce for search to improve performance
 */
const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const debounceTimerRef = useRef(null);

  // Debounce function for search
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Create new timer
    debounceTimerRef.current = setTimeout(() => {
      if (titleInput || locationInput) {
        setSearchFilter({
          title: titleInput,
          location: locationInput,
        });
        setIsSearched(true);
      }
    }, 500); // Wait 500ms after typing stops

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [titleInput, locationInput, setSearchFilter, setIsSearched]);

  const onSearch = (e) => {
    e.preventDefault();
    setSearchFilter({
      title: titleInput,
      location: locationInput,
    });
    setIsSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(e);
    }
  };

  return (
    <div className="px-4 sm:px-5 my-6 sm:my-10">
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-8 sm:py-12 lg:py-16 text-center mx-0 sm:mx-2 rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4 animate-fade-in">
          Over 10,000+ jobs to apply
        </h2>
        <p className="mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base lg:text-lg font-normal px-4 sm:px-5">
          Your Next Big Career Move Starts Right Here - Explore The Best Job
          Opportunities And Take The First Step Toward Your Future!
        </p>

        {/* Search Form - Enhanced Design */}
        <form onSubmit={onSearch} className="max-w-4xl mx-2 sm:mx-4 lg:mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white rounded-lg p-2 sm:p-3 shadow-xl">
            {/* Job Title Search */}
            <div className="flex items-center flex-1 bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <img
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0"
                src={assets.search_icon}
                alt="Search"
              />
              <input
                type="text"
                placeholder="Search for jobs"
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base lg:text-lg"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* Location Search */}
            <div className="flex items-center flex-1 bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <img
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0"
                src={assets.location_icon}
                alt="Location"
              />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base lg:text-lg"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-7 lg:px-10 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      {/* Trusted By Section - Enhanced Design */}
      <div className="border border-gray-200 shadow-md mx-0 sm:mx-2 mt-4 sm:mt-5 p-4 sm:p-6 rounded-lg bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-8 xl:gap-12 flex-wrap">
          <p className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">
            Trusted by
          </p>
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-8 flex-wrap justify-center">
            <img
              className="h-5 sm:h-6 lg:h-7 opacity-70 hover:opacity-100 transition-opacity duration-200"
              src={assets.microsoft_logo}
              alt="Microsoft"
            />
            <img
              className="h-5 sm:h-6 lg:h-7 opacity-70 hover:opacity-100 transition-opacity duration-200"
              src={assets.walmart_logo}
              alt="Walmart"
            />
            <img
              className="h-5 sm:h-6 lg:h-7 opacity-70 hover:opacity-100 transition-opacity duration-200"
              src={assets.accenture_logo}
              alt="Accenture"
            />
            <img
              className="h-5 sm:h-6 lg:h-7 opacity-70 hover:opacity-100 transition-opacity duration-200"
              src={assets.samsung_logo}
              alt="Samsung"
            />
            <img
              className="h-5 sm:h-6 lg:h-7 opacity-70 hover:opacity-100 transition-opacity duration-200"
              src={assets.amazon_logo}
              alt="Amazon"
            />
            <img
              className="h-5 sm:h-6 lg:h-7 opacity-70 hover:opacity-100 transition-opacity duration-200"
              src={assets.adobe_logo}
              alt="Adobe"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
