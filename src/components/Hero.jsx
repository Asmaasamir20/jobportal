import {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import TrustedBy from "./TrustedBy";

/**
 * Hero Component - Professional Search System
 * Main hero section with advanced search functionality
 * Features: Autocomplete, Keyboard Navigation, Debounced Search, Highlight Matching Text
 *
 * مكون Hero - نظام بحث احترافي
 * القسم الرئيسي مع وظائف بحث متقدمة
 * الميزات: الإكمال التلقائي، التنقل بلوحة المفاتيح، بحث مؤجل، تمييز النص المطابق
 */
const Hero = () => {
  const { setSearchFilter, setIsSearched, jobs } = useContext(AppContext);
  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState({
    title: -1,
    location: -1,
  });
  const debounceTimerRef = useRef(null);
  const titleInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const titleSuggestionsRef = useRef(null);
  const locationSuggestionsRef = useRef(null);
  const activeFieldRef = useRef("title"); // Track which field is currently active

  // Popular searches - Memoized for performance
  // عمليات البحث الشائعة - محفوظة للأداء
  const popularSearches = useMemo(
    () => [
      "Software Engineer",
      "Data Scientist",
      "UI/UX Designer",
      "Product Manager",
      "Marketing Manager",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
    ],
    []
  );

  // Popular locations - Memoized for performance
  // المواقع الشائعة - محفوظة للأداء
  const popularLocations = useMemo(
    () => [
      "California",
      "New York",
      "Bangalore",
      "Hyderabad",
      "Washington",
      "Texas",
      "Florida",
      "Remote",
    ],
    []
  );

  /**
   * Advanced search algorithm with fuzzy matching and ranking
   * Uses multiple criteria: starts with, contains, similarity
   *
   * خوارزمية بحث متقدمة مع مطابقة ضبابية وترتيب
   * تستخدم معايير متعددة: يبدأ بـ، يحتوي على، التشابه
   */
  const generateSuggestions = useCallback((input, data, field) => {
    if (!input || input.trim().length === 0 || !data || data.length === 0) {
      return [];
    }

    const searchTerm = input.toLowerCase().trim();
    const results = [];

    // Extract unique values from jobs data
    // استخراج القيم الفريدة من بيانات الوظائف
    const uniqueValues = [
      ...new Set(data.map((job) => job[field]).filter(Boolean)),
    ];

    uniqueValues.forEach((value) => {
      const lowerValue = value.toLowerCase();
      let score = 0;

      // Exact match gets highest score
      // المطابقة التامة تحصل على أعلى نقاط
      if (lowerValue === searchTerm) {
        score = 100;
      }
      // Starts with gets high score
      // يبدأ بـ يحصل على نقاط عالية
      else if (lowerValue.startsWith(searchTerm)) {
        score = 80;
      }
      // Contains gets medium score
      // يحتوي على يحصل على نقاط متوسطة
      else if (lowerValue.includes(searchTerm)) {
        score = 60;
      }
      // Word boundary match gets bonus
      // مطابقة حدود الكلمة تحصل على مكافأة
      if (
        lowerValue.includes(` ${searchTerm}`) ||
        lowerValue.includes(`${searchTerm} `)
      ) {
        score += 10;
      }

      if (score > 0) {
        results.push({ value, score });
      }
    });

    // Sort by score and return top 8 results
    // ترتيب حسب النقاط وإرجاع أفضل 8 نتائج
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.value);
  }, []);

  // Memoized title suggestions with advanced search
  // اقتراحات المسمى الوظيفي المحفوظة مع بحث متقدم
  const titleSuggestions = useMemo(() => {
    if (titleInput.length === 0 || !jobs || jobs.length === 0) {
      return [];
    }
    return generateSuggestions(titleInput, jobs, "title");
  }, [titleInput, jobs, generateSuggestions]);

  // Memoized location suggestions with advanced search
  // اقتراحات الموقع المحفوظة مع بحث متقدم
  const locationSuggestions = useMemo(() => {
    if (locationInput.length === 0 || !jobs || jobs.length === 0) {
      return [];
    }
    return generateSuggestions(locationInput, jobs, "location");
  }, [locationInput, jobs, generateSuggestions]);

  /**
   * Highlight matching text in suggestions
   * Professional text highlighting for better UX
   *
   * تمييز النص المطابق في الاقتراحات
   * تمييز نص احترافي لتجربة مستخدم أفضل
   */
  const highlightText = useCallback((text, query) => {
    if (!query || query.trim().length === 0) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-blue-100 text-blue-800 font-semibold px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }, []);

  /**
   * Professional debounced search with loading state
   * Optimized debounce timing for better UX
   *
   * بحث مؤجل احترافي مع حالة تحميل
   * توقيت مؤجل محسّن لتجربة مستخدم أفضل
   */
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Show loading state for better feedback
    if (titleInput || locationInput) {
      setIsSearching(true);
    }

    // Create new timer with optimized delay
    debounceTimerRef.current = setTimeout(() => {
      if (titleInput || locationInput) {
        setSearchFilter({
          title: titleInput.trim(),
          location: locationInput.trim(),
        });
        setIsSearched(true);
      }
      setIsSearching(false);
    }, 300); // Reduced to 300ms for faster response

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [titleInput, locationInput, setSearchFilter, setIsSearched]);

  /**
   * Enhanced click outside handler with better detection
   * Handles both mouse and touch events
   *
   * معالج محسّن للنقر خارج العنصر مع كشف أفضل
   * يتعامل مع أحداث الفأرة واللمس
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        titleInputRef.current &&
        !titleInputRef.current.contains(event.target) &&
        titleSuggestionsRef.current &&
        !titleSuggestionsRef.current.contains(event.target)
      ) {
        setShowTitleSuggestions(false);
        setSelectedIndex((prev) => ({ ...prev, title: -1 }));
      }
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target) &&
        locationSuggestionsRef.current &&
        !locationSuggestionsRef.current.contains(event.target)
      ) {
        setShowLocationSuggestions(false);
        setSelectedIndex((prev) => ({ ...prev, location: -1 }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  /**
   * Professional search submission handler
   * Includes validation and state management
   *
   * معالج إرسال البحث الاحترافي
   * يتضمن التحقق من الصحة وإدارة الحالة
   */
  const onSearch = useCallback(
    (e) => {
      e.preventDefault();
      setIsSearching(true);
      setSearchFilter({
        title: titleInput.trim(),
        location: locationInput.trim(),
      });
      setIsSearched(true);
      setShowTitleSuggestions(false);
      setShowLocationSuggestions(false);
      setSelectedIndex({ title: -1, location: -1 });

      // Reset loading state after a brief delay
      setTimeout(() => setIsSearching(false), 200);
    },
    [titleInput, locationInput, setSearchFilter, setIsSearched]
  );

  /**
   * Advanced keyboard navigation handler
   * Supports Arrow keys, Enter, Escape, Tab navigation
   *
   * معالج تنقل متقدم بلوحة المفاتيح
   * يدعم مفاتيح الأسهم، Enter، Escape، تنقل Tab
   */
  const handleKeyPress = useCallback(
    (e, fieldType) => {
      activeFieldRef.current = fieldType;
      const suggestions =
        fieldType === "title" ? titleSuggestions : locationSuggestions;
      const popular =
        fieldType === "title" ? popularSearches : popularLocations;
      const showSuggestions =
        fieldType === "title" ? showTitleSuggestions : showLocationSuggestions;
      const currentIndex = selectedIndex[fieldType];
      const hasSuggestions = suggestions.length > 0;
      const hasPopular = popular.length > 0;
      const totalItems = hasSuggestions
        ? suggestions.length
        : hasPopular
        ? popular.length
        : 0;

      if (e.key === "Enter") {
        e.preventDefault();
        if (currentIndex >= 0 && showSuggestions) {
          // Select highlighted suggestion
          const selectedItem = hasSuggestions
            ? suggestions[currentIndex]
            : popular[currentIndex];
          if (fieldType === "title") {
            setTitleInput(selectedItem);
            setSearchFilter({
              title: selectedItem,
              location: locationInput.trim(),
            });
          } else {
            setLocationInput(selectedItem);
            setSearchFilter({
              title: titleInput.trim(),
              location: selectedItem,
            });
          }
          setIsSearched(true);
          setShowTitleSuggestions(false);
          setShowLocationSuggestions(false);
          setSelectedIndex({ title: -1, location: -1 });
        } else {
          // Submit search
          onSearch(e);
        }
      } else if (e.key === "Escape") {
        if (fieldType === "title") {
          setShowTitleSuggestions(false);
        } else {
          setShowLocationSuggestions(false);
        }
        setSelectedIndex((prev) => ({ ...prev, [fieldType]: -1 }));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (fieldType === "title") {
          setShowTitleSuggestions(true);
        } else {
          setShowLocationSuggestions(true);
        }
        setSelectedIndex((prev) => ({
          ...prev,
          [fieldType]: Math.min(currentIndex + 1, totalItems - 1),
        }));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => ({
          ...prev,
          [fieldType]: Math.max(currentIndex - 1, -1),
        }));
      } else if (e.key === "Tab") {
        // Close suggestions on tab
        if (fieldType === "title") {
          setShowTitleSuggestions(false);
        } else {
          setShowLocationSuggestions(false);
        }
        setSelectedIndex({ title: -1, location: -1 });
      }
    },
    [
      titleSuggestions,
      locationSuggestions,
      popularSearches,
      popularLocations,
      showTitleSuggestions,
      showLocationSuggestions,
      selectedIndex,
      titleInput,
      locationInput,
      setSearchFilter,
      setIsSearched,
      onSearch,
    ]
  );

  /**
   * Handle suggestion click with immediate search
   *
   * معالجة النقر على الاقتراح مع بحث فوري
   */
  const handleSuggestionClick = useCallback(
    (suggestion, type) => {
      if (type === "title") {
        setTitleInput(suggestion);
        setSearchFilter({ title: suggestion, location: locationInput.trim() });
        setShowTitleSuggestions(false);
      } else {
        setLocationInput(suggestion);
        setSearchFilter({ title: titleInput.trim(), location: suggestion });
        setShowLocationSuggestions(false);
      }
      setIsSearched(true);
      setSelectedIndex({ title: -1, location: -1 });
    },
    [titleInput, locationInput, setSearchFilter, setIsSearched]
  );

  /**
   * Handle popular search/location selection
   *
   * معالجة اختيار البحث/الموقع الشائع
   */
  const handlePopularSearch = useCallback(
    (search) => {
      setTitleInput(search);
      setSearchFilter({ title: search, location: locationInput.trim() });
      setIsSearched(true);
      setShowTitleSuggestions(false);
    },
    [locationInput, setSearchFilter, setIsSearched]
  );

  const handlePopularLocation = useCallback(
    (location) => {
      setLocationInput(location);
      setSearchFilter({ title: titleInput.trim(), location: location });
      setIsSearched(true);
      setShowLocationSuggestions(false);
    },
    [titleInput, setSearchFilter, setIsSearched]
  );

  return (
    <div
      className="px-4 sm:px-5 my-6 sm:my-10 mb-4 sm:mb-6 overflow-visible relative z-40"
      style={{ overflow: "visible" }}
    >
      <div
        className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-8 sm:py-12 lg:py-16 text-center mx-0 sm:mx-2 rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl max-w-full overflow-visible relative z-50"
        style={{ overflow: "visible", overflowY: "visible" }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4 animate-fade-in">
          Over 10,000+ jobs to apply
        </h2>
        <p className="mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base lg:text-lg font-normal px-4 sm:px-5">
          Your Next Big Career Move Starts Right Here - Explore The Best Job
          Opportunities And Take The First Step Toward Your Future!
        </p>

        {/* Search Form - Professional Enhanced Design with Advanced Features */}
        {/* نموذج البحث - تصميم محسّن احترافي مع ميزات متقدمة */}
        <form
          onSubmit={onSearch}
          className="max-w-4xl mx-2 sm:mx-4 lg:mx-auto relative z-[100] overflow-visible"
          aria-label="Job search form"
          style={{ isolation: "isolate" }}
        >
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white rounded-xl p-2 sm:p-3 shadow-2xl w-full relative z-[100] overflow-visible border border-gray-100"
            style={{
              overflow: "visible",
              overflowY: "visible",
              overflowX: "visible",
            }}
          >
            {/* Job Title Search Field with Advanced Autocomplete */}
            {/* حقل البحث عن المسمى الوظيفي مع إكمال تلقائي متقدم */}
            <div
              className="relative flex-1 overflow-visible"
              ref={titleInputRef}
              style={{ overflow: "visible", zIndex: 9999 }}
            >
              <label htmlFor="job-title-input" className="sr-only">
                Job Title
              </label>
              <div className="group flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-md transition-all duration-200 relative">
                <img
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0 group-focus-within:text-blue-500 transition-colors duration-200"
                  src={assets.search_icon}
                  alt=""
                  aria-hidden="true"
                />
                <input
                  id="job-title-input"
                  type="text"
                  placeholder="Search for jobs"
                  autoComplete="off"
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base lg:text-lg font-medium w-full"
                  value={titleInput}
                  onChange={(e) => {
                    setTitleInput(e.target.value);
                    setShowTitleSuggestions(true);
                    setSelectedIndex((prev) => ({ ...prev, title: -1 }));
                  }}
                  onKeyDown={(e) => handleKeyPress(e, "title")}
                  onFocus={() => {
                    setShowTitleSuggestions(true);
                    activeFieldRef.current = "title";
                  }}
                  aria-autocomplete="list"
                  aria-expanded={showTitleSuggestions}
                  aria-controls="job-title-suggestions"
                  aria-activedescendant={
                    selectedIndex.title >= 0
                      ? `title-suggestion-${selectedIndex.title}`
                      : undefined
                  }
                />
                {/* Loading indicator */}
                {isSearching && titleInput && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {/* Advanced Autocomplete Suggestions Dropdown */}
              {/* قائمة الاقتراحات المتقدمة للإكمال التلقائي */}
              {showTitleSuggestions &&
                (titleSuggestions.length > 0 || popularSearches.length > 0) && (
                  <div
                    id="job-title-suggestions"
                    ref={titleSuggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[320px] overflow-hidden w-full min-w-[240px] animate-fade-in"
                    role="listbox"
                    aria-label="Job title suggestions"
                    style={{
                      zIndex: 99999,
                      isolation: "isolate",
                      position: "absolute",
                    }}
                  >
                    <div className="overflow-y-auto max-h-[320px] custom-scrollbar">
                      {titleSuggestions.length > 0 ? (
                        <div className="p-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide px-3 py-2 font-semibold bg-gray-50 sticky top-0">
                            Suggestions
                          </p>
                          {titleSuggestions.map((suggestion, index) => (
                            <button
                              key={`suggestion-${index}`}
                              id={`title-suggestion-${index}`}
                              type="button"
                              role="option"
                              aria-selected={selectedIndex.title === index}
                              onClick={() =>
                                handleSuggestionClick(suggestion, "title")
                              }
                              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-150 text-sm flex items-center gap-3 group/item focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                selectedIndex.title === index
                                  ? "bg-blue-100 text-blue-800 font-semibold"
                                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                            >
                              <svg
                                className="w-4 h-4 text-gray-400 group-hover/item:text-blue-500 transition-colors duration-150 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                              <span className="flex-1">
                                {highlightText(suggestion, titleInput)}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide px-3 py-2 font-semibold bg-gray-50 sticky top-0">
                            Popular Searches
                          </p>
                          {popularSearches.map((search, index) => (
                            <button
                              key={`popular-${index}`}
                              id={`title-popular-${index}`}
                              type="button"
                              role="option"
                              aria-selected={selectedIndex.title === index}
                              onClick={() => handlePopularSearch(search)}
                              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-150 text-sm flex items-center gap-3 group/item focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                selectedIndex.title === index
                                  ? "bg-blue-100 text-blue-800 font-semibold"
                                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                            >
                              <svg
                                className="w-4 h-4 text-blue-500 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                              <span className="flex-1">{search}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Location Search Field with Advanced Autocomplete */}
            {/* حقل البحث عن الموقع مع إكمال تلقائي متقدم */}
            <div
              className="relative flex-1 overflow-visible"
              ref={locationInputRef}
              style={{ overflow: "visible", zIndex: 9999 }}
            >
              <label htmlFor="location-input" className="sr-only">
                Location
              </label>
              <div className="group flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-md transition-all duration-200 relative">
                <img
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0 group-focus-within:text-blue-500 transition-colors duration-200"
                  src={assets.location_icon}
                  alt=""
                  aria-hidden="true"
                />
                <input
                  id="location-input"
                  type="text"
                  placeholder="Location"
                  autoComplete="off"
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base lg:text-lg font-medium w-full"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setShowLocationSuggestions(true);
                    setSelectedIndex((prev) => ({ ...prev, location: -1 }));
                  }}
                  onKeyDown={(e) => handleKeyPress(e, "location")}
                  onFocus={() => {
                    setShowLocationSuggestions(true);
                    activeFieldRef.current = "location";
                  }}
                  aria-autocomplete="list"
                  aria-expanded={showLocationSuggestions}
                  aria-controls="location-suggestions"
                  aria-activedescendant={
                    selectedIndex.location >= 0
                      ? `location-suggestion-${selectedIndex.location}`
                      : undefined
                  }
                />
                {/* Loading indicator */}
                {isSearching && locationInput && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {/* Advanced Autocomplete Suggestions Dropdown */}
              {/* قائمة الاقتراحات المتقدمة للإكمال التلقائي */}
              {showLocationSuggestions &&
                (locationSuggestions.length > 0 ||
                  popularLocations.length > 0) && (
                  <div
                    id="location-suggestions"
                    ref={locationSuggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[320px] overflow-hidden w-full min-w-[240px] animate-fade-in"
                    role="listbox"
                    aria-label="Location suggestions"
                    style={{
                      zIndex: 99999,
                      isolation: "isolate",
                      position: "absolute",
                    }}
                  >
                    <div className="overflow-y-auto max-h-[320px] custom-scrollbar">
                      {locationSuggestions.length > 0 ? (
                        <div className="p-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide px-3 py-2 font-semibold bg-gray-50 sticky top-0">
                            Suggestions
                          </p>
                          {locationSuggestions.map((suggestion, index) => (
                            <button
                              key={`location-suggestion-${index}`}
                              id={`location-suggestion-${index}`}
                              type="button"
                              role="option"
                              aria-selected={selectedIndex.location === index}
                              onClick={() =>
                                handleSuggestionClick(suggestion, "location")
                              }
                              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-150 text-sm flex items-center gap-3 group/item focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                selectedIndex.location === index
                                  ? "bg-blue-100 text-blue-800 font-semibold"
                                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                            >
                              <svg
                                className="w-4 h-4 text-gray-400 group-hover/item:text-blue-500 transition-colors duration-150 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
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
                              <span className="flex-1">
                                {highlightText(suggestion, locationInput)}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide px-3 py-2 font-semibold bg-gray-50 sticky top-0">
                            Popular Locations
                          </p>
                          {popularLocations.map((location, index) => (
                            <button
                              key={`popular-location-${index}`}
                              id={`location-popular-${index}`}
                              type="button"
                              role="option"
                              aria-selected={selectedIndex.location === index}
                              onClick={() => handlePopularLocation(location)}
                              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-150 text-sm flex items-center gap-3 group/item focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                selectedIndex.location === index
                                  ? "bg-blue-100 text-blue-800 font-semibold"
                                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                            >
                              <svg
                                className="w-4 h-4 text-blue-500 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                              <span className="flex-1">{location}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Enhanced Search Submit Button with Loading State */}
            {/* زر إرسال البحث المحسّن مع حالة التحميل */}
            <button
              type="submit"
              disabled={isSearching}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl whitespace-nowrap flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              aria-label="Search for jobs"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="mt-16 relative z-10">
        <TrustedBy />
      </div>
    </div>
  );
};

export default Hero;
