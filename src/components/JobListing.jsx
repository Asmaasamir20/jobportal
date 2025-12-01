// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import {
//   assets,
//   JobCategories,
//   JobLocations,
// } from "../assets/assets";
// import JobCard from "./JobCard";

// const JobListing = () => {
//   const { isSearched, searchFilter, setSearchFilter, jobs} = useContext(AppContext);

//   const [showFilter,setShowFilter] = useState(false)

//   const [CurrentPage, setCurrentPage] = useState(1)
//   const [selectedCategories,setSelectedCategories] = useState([])
//   const [selectedLocation,setSelectedLocation] = useState([])

//   const [filteredJobs,setFilteredJobs] = useState(jobs)

//   const handleCategoryChange = (category) => {
//     setSelectedCategories(
//       prev => prev.includes(category) ? prev.filter( c => c !== category) : [...prev,category]
//     )
//   }

//   const handleLocationChange = (location) => {
//     setSelectedLocation(
//       prev => prev.includes(location) ? prev.filter( c => c !== location) : [...prev,location]
//     )
//   }

//   useEffect(() => {
//     const matchingCategory = (job) =>
//       selectedCategories.length === 0 || selectedCategories.includes(job.category);

//     const matchingLocation = (job) =>
//       selectedLocation.length === 0 || selectedLocation.includes(job.location);

//     const matchingTitle = (job) =>
//       searchFilter.title === "" ||
//       job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

//     const matchingSearchLocation = (job) =>
//       searchFilter.location === "" ||
//       job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

//     const newFilteredJobs = jobs
//       .slice()
//       .reverse()
//       .filter(
//         (job) =>
//           matchingCategory(job) &&
//           matchingLocation(job) &&
//           matchingTitle(job) &&
//           matchingSearchLocation(job)
//       );

//     setFilteredJobs(newFilteredJobs);
//     setCurrentPage(1);
//   }, [jobs, selectedCategories, selectedLocation, searchFilter]);

//   return (
//     <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
//       {/* Sidebar */}
//       <div className="w-full lg:w-1/4 bg-white px-4">
//         {/* Search Filter from hero component */}
//         {isSearched &&
//           (searchFilter.title !== "" || searchFilter.location !== "") && (
//             <div>
//               <h3 className="font-medium text-lg mb-4">Current Search</h3>
//               <div className="mb-4 text-gray-600">
//                 {searchFilter.title && (
//                   <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
//                     {searchFilter.title}
//                     <img
//                       onClick={() =>
//                         setSearchFilter((prev) => ({ ...prev, title: "" }))
//                       }
//                       className="cursor-pointer"
//                       src={assets.cross_icon}
//                       alt="Remove title filter"
//                     />
//                   </span>
//                 )}
//                 {searchFilter.location && (
//                   <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
//                     {searchFilter.location}
//                     <img
//                       onClick={() =>
//                         setSearchFilter((prev) => ({ ...prev, location: "" }))
//                       }
//                       className="cursor-pointer"
//                       src={assets.cross_icon}
//                       alt="Remove location filter"
//                     />
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}
//           <button onClick={e => setShowFilter(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
//             {showFilter ? "Close" : "Filters"}
//           </button>

//         {/* category filter */}
//         <div className={showFilter ? "" : "max-lg:hidden"}>
//           <h4 className="font-medium text-lg py-4">Search by Categories</h4>
//           <ul className="space-y-4 text-gray-600">
//             {JobCategories.map((category, index) => (
//               <li className="flex gap-3 items-center" key={index}>
//                 <input
//                  className="scale-125"
//                  type="checkbox"
//                  onChange={() => handleCategoryChange(category)}
//                  checked = {selectedCategories.includes(category)}
//                   />
//                 {category}
//               </li>
//             ))}
//           </ul>
//         </div>
//         {/* location filter */}
//         <div className={showFilter ? "" : "max-lg:hidden"}>
//           <h4 className="font-medium text-lg py-4 pt-14">Search by Location</h4>
//           <ul className="space-y-4 text-gray-600">
//             {JobLocations.map((location, index) => (
//               <li className="flex gap-3 items-center" key={index}>
//                 <input
//                 className="scale-125"
//                 type="checkbox"
//                 onChange={() => handleLocationChange(location)}
//                 checked = {selectedLocation.includes(location)} />
//                 {location}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Job listing */}
//       <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
//         <h3 className="font-medium text-3xl py-2" id="job-list">
//           Latest jobs
//         </h3>
//         <p className="mb-8">Get your desired job at top companies</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//           {filteredJobs.slice((CurrentPage-1)*6,CurrentPage*6).map((job, index) => (
//             <JobCard key={index} job={job} />
//           ))}
//         </div>

//         {/* Pagination */}
//         {filteredJobs.length > 0 && (
//           <div className='flex items-center justify-center space-x-2 mt-10'>
//             <a href="#job-list">
//               <img onClick={() => setCurrentPage(Math.max(CurrentPage-1),1)} src={assets.left_arrow_icon} alt="" />
//             </a>
//             {Array.from({length:Math.ceil(filteredJobs.length/6)}).map((_,index) => (
//               <a key={index} href="#job-list">
//                 <button onClick={()=> setCurrentPage(index+1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${CurrentPage === index + 1? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>{index + 1}</button>
//               </a>
//             ))}
//             <a href="#job-list">
//               <img onClick={() => setCurrentPage(Math.min(CurrentPage+1,Math.ceil(filteredJobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
//             </a>
//          </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default JobListing;
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import SkeletonLoader from "./SkeletonLoader";
import EmptyState from "./EmptyState";

/**
 * JobListing Component
 * Displays job listings with filters and search
 * Includes skeleton loaders and enhanced empty states
 */
const JobListing = () => {
  const {
    isSearched,
    searchFilter,
    setSearchFilter,
    setIsSearched,
    jobs,
    loadingJobs,
  } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  // Load current page from localStorage on mount, default to 1
  const [CurrentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("jobListingCurrentPage");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  /**
   * Save current page to localStorage whenever it changes
   * This ensures page number persists after page reload
   */
  useEffect(() => {
    localStorage.setItem("jobListingCurrentPage", CurrentPage.toString());
  }, [CurrentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocation((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedLocation([]);
    setSearchFilter({ title: "", location: "" });
    setIsSearched(false);
  };

  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      setFilteredJobs([]);
      return;
    }

    const matchingCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);

    const matchingLocation = (job) =>
      selectedLocation.length === 0 || selectedLocation.includes(job.location);

    // Search in both job title and category for better results
    const matchingTitle = (job) => {
      if (searchFilter.title === "") return true;
      const searchTerm = searchFilter.title.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchTerm) ||
        (job.category && job.category.toLowerCase().includes(searchTerm)) ||
        (job.companyName && job.companyName.toLowerCase().includes(searchTerm))
      );
    };

    const matchingSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchingCategory(job) &&
          matchingLocation(job) &&
          matchingTitle(job) &&
          matchingSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocation, searchFilter]);

  /**
   * Validate and adjust current page when filtered jobs change
   * Ensures current page doesn't exceed available pages
   */
  useEffect(() => {
    if (filteredJobs.length > 0) {
      const maxPages = Math.ceil(filteredJobs.length / 6);
      if (CurrentPage > maxPages) {
        setCurrentPage(1);
        localStorage.setItem("jobListingCurrentPage", "1");
      }
    }
  }, [filteredJobs.length, CurrentPage]);

  return (
    <div className="px-4 sm:px-5 flex flex-col lg:flex-row max-lg:space-y-6 sm:max-lg:space-y-8 py-6 sm:py-8 gap-4 lg:gap-5">
      {/* Sidebar - Filters - Professional Responsive Design */}
      <div className="w-full lg:w-56 xl:w-64 bg-white px-4 sm:px-5 lg:px-4 xl:px-5 rounded-xl shadow-md border border-gray-200 flex-shrink-0 py-6 sm:py-7 lg:py-6 xl:py-8">
        {/* Active Filters Section - Professional Design */}
        {(isSearched && (searchFilter.title || searchFilter.location)) ||
        selectedCategories.length > 0 ||
        selectedLocation.length > 0 ? (
          <div className="mb-4 sm:mb-5 lg:mb-4 xl:mb-5 pb-3 sm:pb-3.5 lg:pb-3 xl:pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2 sm:mb-2.5">
              <h3 className="font-semibold text-sm sm:text-base lg:text-sm xl:text-base text-gray-800">
                Active Filters
              </h3>
              {(selectedCategories.length > 0 ||
                selectedLocation.length > 0 ||
                searchFilter.title ||
                searchFilter.location) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs sm:text-sm lg:text-xs xl:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-50 border border-blue-200 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm lg:text-xs xl:text-sm font-medium text-blue-700 shadow-sm">
                  <span className="truncate max-w-[100px] sm:max-w-[120px] lg:max-w-[100px] xl:max-w-[120px]">
                    {searchFilter.title}
                  </span>
                  <img
                    onClick={() =>
                      setSearchFilter((prev) => ({ ...prev, title: "" }))
                    }
                    className="cursor-pointer h-3 w-3 sm:h-3.5 sm:w-3.5 hover:opacity-70 transition-opacity flex-shrink-0"
                    src={assets.cross_icon}
                    alt="Remove title filter"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-red-50 border border-red-200 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm lg:text-xs xl:text-sm font-medium text-red-700 shadow-sm">
                  <span className="truncate max-w-[100px] sm:max-w-[120px] lg:max-w-[100px] xl:max-w-[120px]">
                    {searchFilter.location}
                  </span>
                  <img
                    onClick={() =>
                      setSearchFilter((prev) => ({ ...prev, location: "" }))
                    }
                    className="cursor-pointer h-3 w-3 sm:h-3.5 sm:w-3.5 hover:opacity-70 transition-opacity flex-shrink-0"
                    src={assets.cross_icon}
                    alt="Remove location filter"
                  />
                </span>
              )}
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 border border-green-200 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm lg:text-xs xl:text-sm font-medium text-green-700 shadow-sm"
                >
                  <span className="truncate max-w-[90px] sm:max-w-[110px] lg:max-w-[90px] xl:max-w-[110px]">
                    {cat}
                  </span>
                  <img
                    onClick={() => handleCategoryChange(cat)}
                    className="cursor-pointer h-3 w-3 sm:h-3.5 sm:w-3.5 hover:opacity-70 transition-opacity flex-shrink-0"
                    src={assets.cross_icon}
                    alt="Remove category"
                  />
                </span>
              ))}
              {selectedLocation.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-purple-50 border border-purple-200 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm lg:text-xs xl:text-sm font-medium text-purple-700 shadow-sm"
                >
                  <span className="truncate max-w-[90px] sm:max-w-[110px] lg:max-w-[90px] xl:max-w-[110px]">
                    {loc}
                  </span>
                  <img
                    onClick={() => handleLocationChange(loc)}
                    className="cursor-pointer h-3 w-3 sm:h-3.5 sm:w-3.5 hover:opacity-70 transition-opacity flex-shrink-0"
                    src={assets.cross_icon}
                    alt="Remove location"
                  />
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Mobile Filter Toggle Button - Enhanced Design */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 lg:hidden mb-4 sm:mb-5 font-semibold text-sm sm:text-base text-gray-700 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Category Filter - Professional Responsive Design */}
        <div
          className={`${
            showFilter ? "" : "max-lg:hidden"
          } transition-all duration-300`}
        >
          <h4 className="font-semibold text-sm sm:text-base lg:text-sm xl:text-base py-2.5 sm:py-3 lg:py-2.5 xl:py-3 text-gray-800 border-b-2 border-gray-200 flex items-center gap-2 sm:gap-2.5">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>Categories</span>
          </h4>
          <ul className="space-y-1.5 sm:space-y-2 lg:space-y-1.5 xl:space-y-2 text-gray-700 mt-3 sm:mt-3.5 lg:mt-3 xl:mt-4">
            {JobCategories.map((category, index) => (
              <li
                className="flex gap-2 sm:gap-2.5 lg:gap-2 xl:gap-2.5 items-center hover:bg-gray-50 active:bg-gray-100 px-2 sm:px-2.5 py-1.5 sm:py-2 lg:py-1.5 xl:py-2 rounded-lg transition-all duration-150 cursor-pointer group"
                key={index}
              >
                <input
                  className="scale-110 sm:scale-125 lg:scale-110 xl:scale-125 cursor-pointer accent-blue-600"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                  id={`category-${index}`}
                />
                <label
                  htmlFor={`category-${index}`}
                  className="cursor-pointer flex-1 text-sm sm:text-base lg:text-sm xl:text-base group-hover:text-blue-600 group-hover:font-medium transition-all duration-150"
                >
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter - Professional Responsive Design */}
        <div
          className={`${
            showFilter ? "" : "max-lg:hidden"
          } transition-all duration-300 mt-4 sm:mt-5 lg:mt-4 xl:mt-5`}
        >
          <h4 className="font-semibold text-sm sm:text-base lg:text-sm xl:text-base py-2.5 sm:py-3 lg:py-2.5 xl:py-3 text-gray-800 border-b-2 border-gray-200 flex items-center gap-2 sm:gap-2.5">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-blue-600"
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
            <span>Location</span>
          </h4>
          <ul className="space-y-1.5 sm:space-y-2 lg:space-y-1.5 xl:space-y-2 text-gray-700 mt-3 sm:mt-3.5 lg:mt-3 xl:mt-4">
            {JobLocations.map((location, index) => (
              <li
                className="flex gap-2 sm:gap-2.5 lg:gap-2 xl:gap-2.5 items-center hover:bg-gray-50 active:bg-gray-100 px-2 sm:px-2.5 py-1.5 sm:py-2 lg:py-1.5 xl:py-2 rounded-lg transition-all duration-150 cursor-pointer group"
                key={index}
              >
                <input
                  className="scale-110 sm:scale-125 lg:scale-110 xl:scale-125 cursor-pointer accent-blue-600"
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocation.includes(location)}
                  id={`location-${index}`}
                />
                <label
                  htmlFor={`location-${index}`}
                  className="cursor-pointer flex-1 text-sm sm:text-base lg:text-sm xl:text-base group-hover:text-blue-600 group-hover:font-medium transition-all duration-150"
                >
                  {location}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listing Section - More Space */}
      <section className="flex-1 w-full text-gray-800 px-4 pb-10">
        <div className="flex items-center justify-between my-6">
          <div>
            <h3
              className="font-bold text-2xl sm:text-3xl lg:text-4xl py-2"
              id="job-list"
            >
              Latest jobs
            </h3>
            <p className="text-gray-600 text-base sm:text-lg">
              Get your desired job at top companies
            </p>
          </div>
          {!loadingJobs && filteredJobs.length > 0 && (
            <div className="text-sm sm:text-base text-gray-500 hidden sm:block font-medium">
              {filteredJobs.length} jobs available
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {loadingJobs ? (
            <SkeletonLoader count={6} />
          ) : filteredJobs.length > 0 ? (
            filteredJobs
              .slice((CurrentPage - 1) * 6, CurrentPage * 6)
              .map((job, index) => <JobCard key={job.id || index} job={job} />)
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="No jobs found"
                description={
                  isSearched ||
                  selectedCategories.length > 0 ||
                  selectedLocation.length > 0
                    ? "Try searching with different keywords or adjust the filters to find more jobs"
                    : "No jobs available at the moment. Please check back later!"
                }
                showResetButton={
                  isSearched ||
                  selectedCategories.length > 0 ||
                  selectedLocation.length > 0
                }
                onReset={handleResetFilters}
              />
            </div>
          )}
        </div>

        {/* Pagination - محسّن التصميم */}
        {!loadingJobs && filteredJobs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentPage(Math.max(CurrentPage - 1, 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={CurrentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                  CurrentPage === 1
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transform hover:scale-105"
                }`}
                aria-label="Previous page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(
                  (_, index) => {
                    const pageNum = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === Math.ceil(filteredJobs.length / 6) ||
                      (pageNum >= CurrentPage - 1 && pageNum <= CurrentPage + 1)
                    ) {
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-all duration-200 ${
                            CurrentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-md"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === CurrentPage - 2 ||
                      pageNum === CurrentPage + 2
                    ) {
                      return (
                        <span key={index} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={() => {
                  setCurrentPage(
                    Math.min(
                      CurrentPage + 1,
                      Math.ceil(filteredJobs.length / 6)
                    )
                  );
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={CurrentPage === Math.ceil(filteredJobs.length / 6)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                  CurrentPage === Math.ceil(filteredJobs.length / 6)
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transform hover:scale-105"
                }`}
                aria-label="Next page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Showing {(CurrentPage - 1) * 6 + 1} -{" "}
              {Math.min(CurrentPage * 6, filteredJobs.length)} of{" "}
              {filteredJobs.length} jobs
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
