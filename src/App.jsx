import { useContext, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { AppContext } from "./context/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import BackToTop from "./components/BackToTop";
import Loading from "./components/Loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load pages for code splitting and better performance
// تقليل حجم bundle الأولي عبر تحميل الصفحات عند الحاجة فقط
const Home = lazy(() => import("./pages/Home"));
const Applyjob = lazy(() => import("./pages/ApplyJob"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const Applications = lazy(() => import("./pages/Applications"));
const RecruiterLogin = lazy(() => import("./components/RecruiterLogin"));
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddJob = lazy(() => import("./pages/AddJob"));
const ManageJobs = lazy(() => import("./pages/ManageJobs"));
const ViewApplications = lazy(() => import("./pages/ViewApplications"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminManageJobs = lazy(() => import("./pages/AdminManageJobs"));
const AdminManageUsers = lazy(() => import("./pages/AdminManageUsers"));

const App = () => {
  const { showRecruiterLogin, showAdminLogin } = useContext(AppContext);

  return (
    <ErrorBoundary>
      <div className="overflow-x-hidden max-w-full">
        <Suspense fallback={<Loading />}>
          {showRecruiterLogin && <RecruiterLogin />}
          {showAdminLogin && <AdminLogin />}
        </Suspense>
        <ToastContainer />
        <BackToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/job-details/:id" element={<JobDetails />} />
            <Route path="/apply-job/:id" element={<Applyjob />} />
            <Route path="/applications" element={<Applications />} />

            {/* Recruiter Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route
                path="add-job"
                element={
                  <ProtectedRoute requiredToken="company">
                    <AddJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manage-jobs"
                element={
                  <ProtectedRoute requiredToken="company">
                    <ManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-applications"
                element={
                  <ProtectedRoute requiredToken="company">
                    <ViewApplications />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              <Route
                path="manage-jobs"
                element={
                  <ProtectedRoute requiredToken="admin">
                    <AdminManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manage-users"
                element={
                  <ProtectedRoute requiredToken="admin">
                    <AdminManageUsers />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App;
