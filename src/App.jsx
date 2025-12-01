import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Applyjob from "./pages/ApplyJob";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import RecruiterLogin from "./components/RecruiterLogin";
import AdminLogin from "./components/AdminLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageJobs from "./pages/AdminManageJobs";
import AdminManageUsers from "./pages/AdminManageUsers";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { showRecruiterLogin, showAdminLogin } = useContext(AppContext);

  return (
    <ErrorBoundary>
      <div>
        {showRecruiterLogin && <RecruiterLogin />}
        {showAdminLogin && <AdminLogin />}
        <ToastContainer />
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
      </div>
    </ErrorBoundary>
  );
};

export default App;
