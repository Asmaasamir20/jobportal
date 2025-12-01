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
import React, { useContext, useEffect, useState } from "react";
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
  const { isSearched, searchFilter, setSearchFilter, setIsSearched, jobs, loadingJobs } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [CurrentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(
      (prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category])
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(
      (prev) => (prev.includes(location) ? prev.filter((c) => c !== location) : [...prev, location])
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
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

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
      searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter((job) => matchingCategory(job) && matchingLocation(job) && matchingTitle(job) && matchingSearchLocation(job));

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocation, searchFilter]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar - Filters */}
      <div className="w-full lg:w-1/4 bg-white px-4 py-4 rounded-lg shadow-sm border border-gray-100">
        {/* Active Filters Section */}
        {(isSearched && (searchFilter.title || searchFilter.location)) || 
         selectedCategories.length > 0 || 
         selectedLocation.length > 0 ? (
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-lg text-gray-800">Active Filters</h3>
              {(selectedCategories.length > 0 || selectedLocation.length > 0 || 
                searchFilter.title || searchFilter.location) && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-sm">
                  {searchFilter.title}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, title: "" }))}
                    className="cursor-pointer h-3 w-3 hover:opacity-70 transition-opacity"
                    src={assets.cross_icon}
                    alt="Remove title filter"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-sm">
                  {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, location: "" }))}
                    className="cursor-pointer h-3 w-3 hover:opacity-70 transition-opacity"
                    src={assets.cross_icon}
                    alt="Remove location filter"
                  />
                </span>
              )}
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-sm"
                >
                  {cat}
                  <img
                    onClick={() => handleCategoryChange(cat)}
                    className="cursor-pointer h-3 w-3 hover:opacity-70 transition-opacity"
                    src={assets.cross_icon}
                    alt="Remove category"
                  />
                </span>
              ))}
              {selectedLocation.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full text-sm"
                >
                  {loc}
                  <img
                    onClick={() => handleLocationChange(loc)}
                    className="cursor-pointer h-3 w-3 hover:opacity-70 transition-opacity"
                    src={assets.cross_icon}
                    alt="Remove location"
                  />
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="w-full px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200 lg:hidden mb-4 font-medium text-gray-700"
        >
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Category Filter */}
        <div className={`${showFilter ? "" : "max-lg:hidden"} transition-all duration-300`}>
          <h4 className="font-semibold text-lg py-4 text-gray-800 border-b border-gray-200">
            Search by Categories
          </h4>
          <ul className="space-y-3 text-gray-700 mt-4">
            {JobCategories.map((category, index) => (
              <li
                className="flex gap-3 items-center hover:bg-gray-50 p-2 rounded-lg transition-colors duration-150 cursor-pointer"
                key={index}
              >
                <input
                  className="scale-125 cursor-pointer accent-blue-600"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                  id={`category-${index}`}
                />
                <label
                  htmlFor={`category-${index}`}
                  className="cursor-pointer flex-1 text-sm sm:text-base"
                >
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter */}
        <div className={`${showFilter ? "" : "max-lg:hidden"} transition-all duration-300 mt-6`}>
          <h4 className="font-semibold text-lg py-4 text-gray-800 border-b border-gray-200">
            Search by Location
          </h4>
          <ul className="space-y-3 text-gray-700 mt-4">
            {JobLocations.map((location, index) => (
              <li
                className="flex gap-3 items-center hover:bg-gray-50 p-2 rounded-lg transition-colors duration-150 cursor-pointer"
                key={index}
              >
                <input
                  className="scale-125 cursor-pointer accent-blue-600"
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocation.includes(location)}
                  id={`location-${index}`}
                />
                <label
                  htmlFor={`location-${index}`}
                  className="cursor-pointer flex-1 text-sm sm:text-base"
                >
                  {location}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listing Section */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-2xl sm:text-3xl py-2" id="job-list">
              Latest jobs
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Get your desired job at top companies
            </p>
          </div>
          {!loadingJobs && filteredJobs.length > 0 && (
            <div className="text-sm text-gray-500 hidden sm:block">
              {filteredJobs.length} jobs available
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {loadingJobs ? (
            <SkeletonLoader count={6} />
          ) : filteredJobs.length > 0 ? (
            filteredJobs
              .slice((CurrentPage - 1) * 6, CurrentPage * 6)
              .map((job, index) => (
                <JobCard key={job.id || index} job={job} />
              ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="No jobs found"
                description={
                  isSearched || selectedCategories.length > 0 || selectedLocation.length > 0
                    ? "Try searching with different keywords or adjust the filters to find more jobs"
                    : "No jobs available at the moment. Please check back later!"
                }
                showResetButton={
                  isSearched || selectedCategories.length > 0 || selectedLocation.length > 0
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
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  CurrentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500"
                }`}
                aria-label="Previous page"
              >
                <img
                  src={assets.left_arrow_icon}
                  alt="Previous"
                  className="h-5 w-5"
                />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => {
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
                })}
              </div>

              <button
                onClick={() => {
                  setCurrentPage(
                    Math.min(CurrentPage + 1, Math.ceil(filteredJobs.length / 6))
                  );
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={CurrentPage === Math.ceil(filteredJobs.length / 6)}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  CurrentPage === Math.ceil(filteredJobs.length / 6)
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500"
                }`}
                aria-label="Next page"
              >
                <img
                  src={assets.right_arrow_icon}
                  alt="Next"
                  className="h-5 w-5"
                />
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {((CurrentPage - 1) * 6) + 1} - {Math.min(CurrentPage * 6, filteredJobs.length)} of {filteredJobs.length} jobs
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
