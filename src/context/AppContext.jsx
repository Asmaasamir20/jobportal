import React, { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // بحث المستخدم
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);

  // Loading states
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState(null);

  // الوظائف
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem("jobs");
    return savedJobs ? JSON.parse(savedJobs) : [];
  });

  // بيانات الشركة
  const [companyToken, setCompanyToken] = useState(() => {
    return localStorage.getItem("companyToken") || null;
  });
  const [companyData, setCompanyData] = useState(() => {
    try {
      const savedCompany = localStorage.getItem("companyData");
      if (savedCompany) {
        const parsed = JSON.parse(savedCompany);
        // Clean up old blob URLs
        if (parsed.image && parsed.image.startsWith("blob:")) {
          parsed.image = null;
          localStorage.setItem("companyData", JSON.stringify(parsed));
        }
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Error parsing companyData:", error);
      return null;
    }
  });

  // بيانات المستخدم
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userApplications, setUserApplications] = useState(() => {
    const savedApps = localStorage.getItem("userApplications");
    return savedApps ? JSON.parse(savedApps) : [];
  });

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  // Admin state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem("adminToken") || null;
  });
  const [adminData, setAdminData] = useState(() => {
    const savedAdmin = localStorage.getItem("adminData");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  // حفظ البيانات في localStorage عند أي تغيير
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    if (companyToken && companyData) {
      try {
        // Ensure image is base64, not blob URL
        const dataToSave = { ...companyData };
        if (dataToSave.image && dataToSave.image.startsWith("blob:")) {
          dataToSave.image = null;
        }
        localStorage.setItem("companyData", JSON.stringify(dataToSave));
        localStorage.setItem("companyToken", companyToken);
      } catch (error) {
        console.error("Error saving companyData:", error);
      }
    } else if (!companyToken) {
      // Clear data if token is removed
      localStorage.removeItem("companyData");
      localStorage.removeItem("companyToken");
    }
  }, [companyToken, companyData]);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("userApplications", JSON.stringify(userApplications));
  }, [userApplications]);

  useEffect(() => {
    if (adminToken && adminData) {
      localStorage.setItem("adminData", JSON.stringify(adminData));
      localStorage.setItem("adminToken", adminToken);
    }
  }, [adminToken, adminData]);

  // محاكاة API call لجلب الوظائف عند تحميل الصفحة
  useEffect(() => {
    const fetchJobs = async () => {
      // إذا كانت هناك وظائف محفوظة، لا نحتاج لجلبها
      const savedJobs = localStorage.getItem("jobs");
      if (savedJobs && JSON.parse(savedJobs).length > 0) {
        return;
      }

      setLoadingJobs(true);
      setError(null);

      try {
        // محاكاة delay للـ API call (1-2 ثانية)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // استخدام البيانات الافتراضية من assets.js
        const formattedJobs = jobsData.map((job) => ({
          id: job._id,
          title: job.title,
          location: job.location,
          level: job.level,
          category: job.category,
          description: job.description,
          salary: job.salary,
          date: job.date,
          companyName: job.companyId?.name || "Company",
          companyImage: job.companyId?.image || null,
          companyId: job.companyId?._id || null,
        }));

        setJobs(formattedJobs);
        localStorage.setItem("jobs", JSON.stringify(formattedJobs));
      } catch (err) {
        setError("فشل في تحميل الوظائف. يرجى المحاولة مرة أخرى.");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    loadingJobs,
    setLoadingJobs,
    error,
    setError,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    showAdminLogin,
    setShowAdminLogin,
    adminToken,
    setAdminToken,
    adminData,
    setAdminData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
