import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login"); // 'Login' or 'Sign Up'
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [isTextDataSubmited, setIsDataSubmited] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setShowRecruiterLogin, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  /**
   * Convert image file to base64 string
   * This allows the image to persist after browser refresh
   */
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Retrieve stored companies from localStorage
    const storedCompanies = JSON.parse(
      localStorage.getItem("companies") || "[]"
    );

    if (state === "Sign Up") {
      if (!isTextDataSubmited) {
        return setIsDataSubmited(true);
      }

      // Check if email already exists
      if (storedCompanies.find((c) => c.email === email)) {
        toast.error("Email already exists! Please use a different email.");
        return;
      }

      // Convert image to base64 if exists
      let imageBase64 = null;
      if (image) {
        try {
          imageBase64 = await convertImageToBase64(image);
        } catch (error) {
          toast.error("Error processing image. Please try again.");
          console.error("Image conversion error:", error);
          return;
        }
      }

      const newCompany = {
        name,
        email,
        password,
        image: imageBase64,
      };

      storedCompanies.push(newCompany);
      localStorage.setItem("companies", JSON.stringify(storedCompanies));

      // Set context and localStorage token
      setCompanyData(newCompany);
      setCompanyToken("localToken");
      localStorage.setItem("companyToken", "localToken");
      localStorage.setItem("companyData", JSON.stringify(newCompany));

      toast.success("Account created successfully! Welcome to the platform.");
      setShowRecruiterLogin(false);
      navigate("/dashboard");
    } else {
      // Login logic
      const company = storedCompanies.find(
        (c) => c.email === email && c.password === password
      );
      if (!company) {
        toast.error(
          "Invalid credentials! Please check your email and password."
        );
        return;
      }

      setCompanyData(company);
      setCompanyToken("localToken");
      localStorage.setItem("companyToken", "localToken");
      localStorage.setItem("companyData", JSON.stringify(company));

      toast.success(`Welcome back, ${company.name}!`);
      setShowRecruiterLogin(false);
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={onSubmitHandler}
          className="relative bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl text-slate-500"
        >
          <h1 className="text-center text-2xl sm:text-3xl text-neutral-800 font-bold mb-2">
            Recruiter {state}
          </h1>

          {state === "Login" && (
            <p className="text-sm mt-2 mb-6 text-center text-gray-600">
              Enter your recruiter credentials to access your dashboard
            </p>
          )}

          {state === "Sign Up" && isTextDataSubmited ? (
            <div className="flex flex-col items-center gap-4 my-8">
              <label className="cursor-pointer group" htmlFor="image">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-blue-500 transition-colors duration-200 shadow-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      image ? URL.createObjectURL(image) : assets.upload_area
                    }
                    alt="Upload Area"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  accept="image/*"
                  hidden
                  id="image"
                />
              </label>
              <p className="text-sm text-gray-600 font-medium text-center">
                Upload Company Logo
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              <p className="text-sm text-gray-600 text-center">
                {state === "Sign Up" ? "Create an account to get started!" : ""}
              </p>

              {state !== "Login" && (
                <div className="border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 bg-gray-50 focus-within:bg-white">
                  <img
                    src={assets.person_icon}
                    alt="Person Icon"
                    className="w-5 h-5 opacity-60"
                  />
                  <input
                    className="outline-none text-sm flex-1 bg-transparent text-gray-700 placeholder-gray-400"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Company Name"
                    required
                  />
                </div>
              )}

              <div className="border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 bg-gray-50 focus-within:bg-white">
                <img
                  src={assets.email_icon}
                  alt="Email Icon"
                  className="w-5 h-5 opacity-60"
                />
                <input
                  className="outline-none text-sm flex-1 bg-transparent text-gray-700 placeholder-gray-400"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email ID"
                  required
                />
              </div>

              <div className="border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 bg-gray-50 focus-within:bg-white">
                <img
                  src={assets.lock_icon}
                  alt="Lock Icon"
                  className="w-5 h-5 opacity-60"
                />
                <input
                  className="outline-none text-sm flex-1 bg-transparent text-gray-700 placeholder-gray-400"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors p-1"
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
            </div>
          )}

          {state === "Login" && (
            <p className="text-sm text-blue-600 mt-4 cursor-pointer hover:text-blue-700 transition-colors duration-200 text-center">
              Forget password?
            </p>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full text-white py-3 rounded-xl mt-6 font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {state === "Login"
              ? "Login"
              : isTextDataSubmited
              ? "Create Account"
              : "Next"}
            {state === "Login" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            )}
          </button>

          {state === "Login" ? (
            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer font-semibold hover:text-blue-700 hover:underline transition-colors duration-200"
                onClick={() => setState("Sign Up")}
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer font-semibold hover:text-blue-700 hover:underline transition-colors duration-200"
                onClick={() => setState("Login")}
              >
                Login
              </span>
            </p>
          )}
          <button
            type="button"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
            onClick={() => setShowRecruiterLogin(false)}
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterLogin;
