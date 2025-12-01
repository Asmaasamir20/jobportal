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

      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center ">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={JobData.companyImage || assets.default_company}
                alt={JobData.companyName || "Company"}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{JobData.title}</h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
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

            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              {!user?.resume && (
                <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer mb-2">
                  Upload Resume
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => uploadResume(e.target.files[0])}
                  />
                </label>
              )}
              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded"
              >
                Apply Now
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              ></div>
              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10"
              >
                Apply Now
              </button>
            </div>

            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More jobs from {JobData.companyName}</h2>
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

export default Applyjob;
