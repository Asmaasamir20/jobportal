import { useContext, useEffect, useState } from "react";
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
        if (
          !isNaN(currentJobIdNum) &&
          !isNaN(jobIdNum) &&
          currentJobIdNum === jobIdNum
        ) {
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

      <div className="min-h-screen flex flex-col py-6 sm:py-10 px-4 sm:px-5 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="bg-white text-black rounded-xl sm:rounded-2xl w-full shadow-xl overflow-hidden">
          {/* Enhanced Header Section with Gradient Background */}
          <div className="relative flex justify-center md:justify-between flex-wrap gap-4 sm:gap-8 px-4 sm:px-8 lg:px-14 py-8 sm:py-12 lg:py-20 mb-4 sm:mb-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50 border-b-4 border-indigo-500/20">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl"></div>
                <img
                  className="relative h-20 sm:h-24 lg:h-28 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-white/50"
                  src={
                    JobData.companyImage &&
                    !JobData.companyImage.startsWith("blob:")
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
                    <img
                      src={assets.suitcase_icon}
                      alt=""
                      className="w-4 h-4"
                    />
                    {JobData.companyName}
                  </span>
                  <span className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200/50 text-gray-700 font-semibold">
                    <img
                      src={assets.location_icon}
                      alt=""
                      className="w-4 h-4"
                    />
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
              <button
                onClick={handleApply}
                className="group relative bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 hover:from-indigo-700 hover:via-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Apply Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <p className="text-gray-500 text-sm sm:text-base font-medium flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="w-full lg:w-2/3">
              <div className="mb-6 sm:mb-8">
                <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl mb-2 text-gray-900 flex items-center gap-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"></div>
                  Job Description
                </h2>
                <p className="text-gray-500 text-base sm:text-lg">
                  Discover what makes this role special
                </p>
              </div>
              <div
                className="rich-text prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 mb-8 sm:mb-10"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              ></div>
              <button
                onClick={handleApply}
                className="group relative w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 hover:from-indigo-700 hover:via-blue-700 hover:to-blue-800 text-white px-8 sm:px-12 py-4 sm:py-4.5 rounded-xl font-bold text-lg sm:text-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Apply Now
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300"
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
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="w-full lg:w-1/3 mt-6 lg:mt-0 space-y-4 sm:space-y-5">
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50/50 rounded-xl p-4 sm:p-5 border border-gray-200/50 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  More jobs from {JobData.companyName}
                </h2>
                <p className="text-gray-500 text-base sm:text-lg mb-4">
                  Explore other opportunities
                </p>
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

export default JobDetails;
