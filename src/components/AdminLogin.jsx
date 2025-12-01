import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * AdminLogin Component
 * Modal component for admin authentication
 * Matches the design pattern of RecruiterLogin
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setShowAdminLogin, setAdminToken, setAdminData } =
    useContext(AppContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Admin credentials - Secure password
    const ADMIN_EMAIL = "admin@jobportal.com";
    const ADMIN_PASSWORD = "Admin@Secure2024!";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminInfo = {
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
      };

      setAdminData(adminInfo);
      setAdminToken("adminToken");
      localStorage.setItem("adminData", JSON.stringify(adminInfo));
      localStorage.setItem("adminToken", "adminToken");

      toast.success("Login successful! Welcome back, Admin.");
      setShowAdminLogin(false);
      navigate("/admin/dashboard");
    } else {
      toast.error(
        "Invalid admin credentials! Please check your email and password."
      );
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <div>
        <form
          onSubmit={onSubmitHandler}
          className="relative bg-white p-10 rounded-xl text-slate-500"
        >
          <h1 className="text-center text-2xl text-neutral-700 font-medium">
            Admin Login
          </h1>

          <p className="text-sm mt-2 mb-5 text-center">
            Enter your admin credentials
          </p>

          <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.email_icon} alt="Email Icon" />
            <input
              className="outline-none text-sm"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Admin Email"
              required
            />
          </div>

          <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              className="outline-none text-sm flex-1"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
          >
            Login
          </button>

          <img
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => setShowAdminLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
