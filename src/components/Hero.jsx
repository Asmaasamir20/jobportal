import { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import TrustedBy from "./TrustedBy";
/**
 * Hero Component
 * Main hero section with search bar
 * Includes debounce for search, autocomplete, and popular searches
 */
const Hero = () => {
  const { setSearchFilter, setIsSearched, jobs } = useContext(AppContext);
  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const debounceTimerRef = useRef(null);
  const titleInputRef = useRef(null);
  const locationInputRef = useRef(null);
   
  // Popular searches
  const popularSearches = [
    "Software Engineer",
    "Data Scientist",
    "UI/UX Designer",
    "Product Manager",
    "Marketing Manager",
  ];

  // Popular locations
  const popularLocations = [
    "California",
    "New York",
    "Bangalore",
    "Hyderabad",
    "Washington",
  ];

  // Generate suggestions based on input
  useEffect(() => {
    if (titleInput.length > 0 && jobs && jobs.length > 0) {
      const uniqueTitles = [
        ...new Set(
          jobs
            .map((job) => job.title)
            .filter((title) =>
              title.toLowerCase().includes(titleInput.toLowerCase())
            )
        ),
      ].slice(0, 5);
      setTitleSuggestions(uniqueTitles);
      setShowTitleSuggestions(true);
    } else {
      setTitleSuggestions([]);
      setShowTitleSuggestions(false);
    }
  }, [titleInput, jobs]);

  useEffect(() => {
    if (locationInput.length > 0 && jobs && jobs.length > 0) {
      const uniqueLocations = [
        ...new Set(
          jobs
            .map((job) => job.location)
            .filter((location) =>
              location.toLowerCase().includes(locationInput.toLowerCase())
            )
        ),
      ].slice(0, 5);
      setLocationSuggestions(uniqueLocations);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  }, [locationInput, jobs]);

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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        titleInputRef.current &&
        !titleInputRef.current.contains(event.target)
      ) {
        setShowTitleSuggestions(false);
      }
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setShowTitleSuggestions(false);
      setShowLocationSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion, type) => {
    if (type === "title") {
      setTitleInput(suggestion);
      setShowTitleSuggestions(false);
    } else {
      setLocationInput(suggestion);
      setShowLocationSuggestions(false);
    }
  };

  const handlePopularSearch = (search) => {
    setTitleInput(search);
    setSearchFilter({ title: search, location: locationInput });
    setIsSearched(true);
  };

  const handlePopularLocation = (location) => {
    setLocationInput(location);
    setSearchFilter({ title: titleInput, location: location });
    setIsSearched(true);
  };

  return (
    <div className="px-4 sm:px-5 my-6 sm:my-10 mb-4 sm:mb-6 overflow-visible relative z-40">
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-8 sm:py-12 lg:py-16 text-center mx-0 sm:mx-2 rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl max-w-full overflow-visible relative">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4 animate-fade-in">
          Over 10,000+ jobs to apply
        </h2>
        <p className="mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base lg:text-lg font-normal px-4 sm:px-5">
          Your Next Big Career Move Starts Right Here - Explore The Best Job
          Opportunities And Take The First Step Toward Your Future!
        </p>

        {/* Search Form - Enhanced Design with Autocomplete */}
        <form
          onSubmit={onSearch}
          className="max-w-4xl mx-2 sm:mx-4 lg:mx-auto relative z-[90] overflow-visible"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white rounded-lg p-2 sm:p-3 shadow-xl w-full relative z-[90] overflow-visible">
            {/* Job Title Search with Autocomplete */}
            <div
              className="relative flex-1 overflow-visible"
              ref={titleInputRef}
            >
              <div className="flex items-center bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
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
                  onChange={(e) => {
                    setTitleInput(e.target.value);
                    setShowTitleSuggestions(true);
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowTitleSuggestions(true)}
                />
              </div>
              {/* Autocomplete Suggestions */}
              {showTitleSuggestions &&
                (titleSuggestions.length > 0 || popularSearches.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-[100] max-h-60 overflow-y-auto w-full min-w-[200px]">
                    {titleSuggestions.length > 0 ? (
                      <div className="p-2">
                        <p className="text-xs text-gray-500 px-3 py-1 font-semibold">
                          Suggestions
                        </p>
                        {titleSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(suggestion, "title")
                            }
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm text-gray-700 flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4 text-gray-400"
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
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2">
                        <p className="text-xs text-gray-500 px-3 py-1 font-semibold">
                          Popular Searches
                        </p>
                        {popularSearches.map((search, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handlePopularSearch(search)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm text-gray-700 flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4 text-blue-500"
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
                            {search}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Location Search with Autocomplete */}
            <div
              className="relative flex-1 overflow-visible"
              ref={locationInputRef}
            >
              <div className="flex items-center bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
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
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowLocationSuggestions(true)}
                />
              </div>
              {/* Autocomplete Suggestions */}
              {showLocationSuggestions &&
                (locationSuggestions.length > 0 ||
                  popularLocations.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-[100] max-h-60 overflow-y-auto w-full min-w-[200px]">
                    {locationSuggestions.length > 0 ? (
                      <div className="p-2">
                        <p className="text-xs text-gray-500 px-3 py-1 font-semibold">
                          Suggestions
                        </p>
                        {locationSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(suggestion, "location")
                            }
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm text-gray-700 flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4 text-gray-400"
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
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2">
                        <p className="text-xs text-gray-500 px-3 py-1 font-semibold">
                          Popular Locations
                        </p>
                        {popularLocations.map((location, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handlePopularLocation(location)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm text-gray-700 flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4 text-blue-500"
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
                            {location}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-7 lg:px-10 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
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
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="mt-16">
        <TrustedBy />
      </div>
    </div>
  );
};

export default Hero;
