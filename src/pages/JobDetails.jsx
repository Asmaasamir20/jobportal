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
import { useUser, useClerk } from "@clerk/clerk-react";

/**
 * JobDetails Component
 * Displays full job details without requiring authentication
 * Users can view job information and apply if logged in
 */
const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [JobData, setJobData] = useState(null);
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
        
        // مقارنة مباشرة كرقم
        if (!isNaN(currentJobIdNum) && !isNaN(jobIdNum) && currentJobIdNum === jobIdNum) {
          return true;
        }
        
        // مقارنة مباشرة
        if (currentJobId === jobIdFromUrl || currentJobId === jobIdNum) {
          return true;
        }
        
        return false;
      });
      
      if (!job) {
        toast.error("Job not found!");
        navigate("/");
        return;
      }
      
      setJobData(job);
    } catch (error) {
      console.error("Error loading job data:", error);
      toast.error("Error loading job data. Please try again.");
      navigate("/");
    }
  }, [id, navigate]);

  /**
   * Handle job application - requires login
   */
  const handleApply = () => {
    if (!user) {
      toast.info("يرجى تسجيل الدخول أولاً للتقديم على الوظيفة");
      openSignIn();
      return;
    }

    if (!JobData || !JobData.id) {
      toast.error("Job data is missing. Please try again.");
      return;
    }

    navigate(`/apply-job/${JobData.id}`);
  };

  if (!JobData) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-6 sm:py-10 px-4 sm:px-5">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-4 sm:gap-8 px-4 sm:px-8 lg:px-14 py-8 sm:py-12 lg:py-20 mb-4 sm:mb-6 bg-sky-50 border border-sky-400 rounded-lg sm:rounded-xl">
            <div className="flex flex-col md:flex-row items-center ">
              <img
                className="h-16 sm:h-20 lg:h-24 bg-white rounded-lg p-2 sm:p-4 mr-0 md:mr-4 max-md:mb-4 border"
                src={JobData.companyImage || assets.company_icon}
                alt={JobData.companyName || "Company"}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium">{JobData.title}</h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-3 sm:gap-4 lg:gap-6 items-center text-sm sm:text-base text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyName}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-xs sm:text-sm max-md:mx-auto max-md:text-center mt-4 md:mt-0">
              <button
                onClick={handleApply}
                className="bg-blue-600 p-2 sm:p-2.5 px-6 sm:px-8 lg:px-10 text-white rounded text-xs sm:text-sm mb-2"
              >
                Apply Now
              </button>
              <p className="mt-1 text-gray-600 text-xs sm:text-sm">
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-xl sm:text-2xl mb-3 sm:mb-4">Job description</h2>
              <div
                className="rich-text prose prose-sm sm:prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              ></div>
              <button
                onClick={handleApply}
                className="bg-blue-600 p-2 sm:p-2.5 px-6 sm:px-8 lg:px-10 text-white rounded text-xs sm:text-sm mt-6 sm:mt-10"
              >
                Apply Now
              </button>
            </div>

            <div className="w-full lg:w-1/3 mt-6 lg:mt-0 lg:ml-8 space-y-4 sm:space-y-5">
              <h2 className="text-lg sm:text-xl font-semibold">More jobs from {JobData.companyName}</h2>
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

      <Footer />
    </>
  );
};

export default JobDetails;

