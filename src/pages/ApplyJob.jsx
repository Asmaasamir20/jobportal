import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import kconvert from "k-convert";
import moment from "moment";
import { toast } from "react-toastify";

const Applyjob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [JobData, setJobData] = useState(null);
  const [user, setUser] = useState(null);
  const { jobs } = useContext(AppContext);

  useEffect(() => {
    // التحقق من وجود id في الـ URL
    if (!id) {
      toast.error("Invalid job ID!");
      navigate("/");
      return;
    }

    try {
      // جلب الوظيفة من LocalStorage
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      
      if (!Array.isArray(storedJobs) || storedJobs.length === 0) {
        toast.error("No jobs available!");
        navigate("/");
        return;
      }

      // البحث عن الوظيفة - دعم id كنص أو رقم
      // بعض الوظائف القديمة من assets.js تستخدم id كنص ('1', '2') 
      // والوظائف الجديدة من AddJob تستخدم id كرقم (Date.now())
      // id من useParams() دائماً نص
      const jobIdFromUrl = String(id).trim();
      const jobIdNum = Number(jobIdFromUrl);
      
      const job = storedJobs.find((j) => {
        if (!j || j.id === undefined || j.id === null) return false;
        
        const currentJobId = j.id;
        const currentJobIdStr = String(currentJobId).trim();
        const currentJobIdNum = Number(currentJobId);
        
        // مقارنة مباشرة كنص
        if (currentJobIdStr === jobIdFromUrl) {
          return true;
        }
        
        // مقارنة مباشرة كرقم (إذا كان كلاهما أرقام صحيحة)
        if (!isNaN(currentJobIdNum) && !isNaN(jobIdNum) && currentJobIdNum === jobIdNum) {
          return true;
        }
        
        // مقارنة مباشرة (نص مع نص أو رقم مع رقم)
        if (currentJobId === jobIdFromUrl || currentJobId === jobIdNum) {
          return true;
        }
        
        return false;
      });
      
      if (!job) {
        console.error("Job not found!", {
          searchedId: id,
          jobIdFromUrl: jobIdFromUrl,
          jobIdNum: jobIdNum,
          jobsInStorage: storedJobs.length,
          sampleJobIds: storedJobs.slice(0, 5).map(j => ({ 
            id: j.id, 
            type: typeof j.id,
            title: j.title 
          }))
        });
        toast.error("Job not found!");
        navigate("/");
        return;
      }
      
      setJobData(job);

      // جلب بيانات المستخدم
      const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
      setUser(storedUser);
    } catch (error) {
      console.error("Error loading job data:", error);
      toast.error("Error loading job data. Please try again.");
      navigate("/");
    }
  }, [id, navigate]);

  const uploadResume = (file) => {
    if (!file) return;
    const updatedUser = { ...user, resume: file.name };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success("Resume uploaded successfully!");
  };

  /**
   * Handle job application submission
   * Validates user data and prevents duplicate applications
   */
  const applyHandler = () => {
    try {
      // التحقق من وجود بيانات الوظيفة
      if (!JobData || !JobData.id) {
        toast.error("Job data is missing. Please try again.");
        return;
      }

      // التحقق من تسجيل الدخول
      if (!user || !user.clerkId) {
        toast.error("Please login to apply for jobs");
        return;
      }

      // التحقق من وجود السيرة الذاتية
      if (!user.resume) {
        toast.error("Please upload your resume before applying");
        return;
      }

      // جلب الطلبات السابقة
      let storedApplications = [];
      try {
        const stored = localStorage.getItem("userApplications");
        storedApplications = stored ? JSON.parse(stored) : [];
        
        if (!Array.isArray(storedApplications)) {
          storedApplications = [];
        }
      } catch (error) {
        console.error("Error reading applications:", error);
        storedApplications = [];
      }

      // التحقق من التقديم السابق
      const alreadyApplied = storedApplications.find(
        (app) => app.jobId === JobData.id && app.userId === user.clerkId
      );

      if (alreadyApplied) {
        toast.info("You have already applied for this job.");
        return;
      }

      // إنشاء طلب جديد
      const newApplication = {
        jobId: JobData.id,
        userId: user.clerkId,
        appliedAt: new Date().toISOString(),
      };

      // حفظ الطلب
      localStorage.setItem(
        "userApplications",
        JSON.stringify([...storedApplications, newApplication])
      );

      toast.success("Applied successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (!JobData) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-6 sm:py-10 px-4 sm:px-5 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="bg-white text-black rounded-xl sm:rounded-2xl w-full shadow-xl overflow-hidden">
          {/* Enhanced Header Section with Gradient Background */}
          <div className="relative flex justify-center md:justify-between flex-wrap gap-4 sm:gap-8 px-4 sm:px-8 lg:px-14 py-8 sm:py-12 lg:py-20 mb-4 sm:mb-6 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border-b-4 border-blue-500/20">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
                <img
                  className="relative h-20 sm:h-24 lg:h-28 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-white/50"
                  src={
                    JobData.companyImage && !JobData.companyImage.startsWith("blob:")
                      ? JobData.companyImage
                      : assets.company_icon
                  }
                  alt={JobData.companyName || "Company"}
                  onError={(e) => {
                    e.target.src = assets.company_icon;
                  }}
                />
              </div>
              <div className="text-center md:text-left text-neutral-800">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  {JobData.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-3 sm:gap-4 lg:gap-6 items-center text-base sm:text-lg mt-3">
                  <span className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200/50 text-gray-700 font-semibold">
                    <img src={assets.suitcase_icon} alt="" className="w-4 h-4" />
                    {JobData.companyName}
                  </span>
                  <span className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200/50 text-gray-700 font-semibold">
                    <img src={assets.location_icon} alt="" className="w-4 h-4" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200/50 text-gray-700 font-semibold">
                    <img src={assets.person_icon} alt="" className="w-4 h-4" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-lg shadow-sm border border-green-200/50 text-green-700 font-bold">
                    <img src={assets.money_icon} alt="" className="w-4 h-4" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col justify-center items-end text-end text-sm sm:text-base max-md:mx-auto max-md:text-center max-md:items-center mt-4 md:mt-0 space-y-3">
              {!user?.resume && (
                <label className="group relative bg-white hover:bg-gray-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-700 font-semibold text-sm sm:text-base">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => uploadResume(e.target.files[0])}
                  />
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Resume
                  </span>
                </label>
              )}
              <button
                onClick={applyHandler}
                className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Apply Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <p className="text-gray-500 text-sm sm:text-base font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="w-full lg:w-2/3">
              <div className="mb-6 sm:mb-8">
                <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl mb-2 text-gray-900 flex items-center gap-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                  Job Description
                </h2>
                <p className="text-gray-500 text-base sm:text-lg">Learn more about this exciting opportunity</p>
              </div>
              <div
                className="rich-text prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 mb-8 sm:mb-10"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              ></div>
              <button
                onClick={applyHandler}
                className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-8 sm:px-12 py-4 sm:py-4.5 rounded-xl font-bold text-lg sm:text-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Apply Now
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="w-full lg:w-1/3 mt-6 lg:mt-0 space-y-4 sm:space-y-5">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl p-4 sm:p-5 border border-gray-200/50 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  More jobs from {JobData.companyName}
                </h2>
                <p className="text-gray-500 text-base sm:text-lg mb-4">Explore other opportunities</p>
                <div className="space-y-4">
                  {Array.isArray(jobs) &&
                    jobs
                      .filter(
                        (job) =>
                          job.id !== JobData.id &&
                          job.companyEmail === JobData.companyEmail
                      )
                      .slice(0, 4)
                      .map((job) => <JobCard key={job.id} job={job} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Applyjob;
