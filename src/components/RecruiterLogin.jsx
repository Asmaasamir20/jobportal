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
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <div>
        <form
          onSubmit={onSubmitHandler}
          className="relative bg-white p-10 rounded-xl text-slate-500"
        >
          <h1 className="text-center text-2xl text-neutral-700 font-medium">
            Recruiter {state}
          </h1>

          {state === "Login" && (
            <p className="text-sm mt-2 mb-5 text-center">
              Enter your recruiter credentials
            </p>
          )}

          {state === "Sign Up" && isTextDataSubmited ? (
            <div className="flex items-center gap-4 my-10">
              <label className="w-16 rounded-full" htmlFor="image">
                <img
                  className="w-16"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="Upload Area"
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  hidden
                  id="image"
                />
              </label>
              <p>
                Upload Company <br /> Logo{" "}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm">
                {state === "Sign Up" ? "Create an account to get started!" : ""}
              </p>

              {state !== "Login" && (
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                  <img src={assets.person_icon} alt="Person Icon" />
                  <input
                    className="outline-none text-sm"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Company Name"
                    required
                  />
                </div>
              )}

              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.email_icon} alt="Email Icon" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email ID"
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
            </>
          )}

          {state === "Login" && (
            <p className="text-sm text-blue-600 mt-4 cursor-pointer">
              Forget password
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
          >
            {state === "Login"
              ? "Login"
              : isTextDataSubmited
              ? "Create Account"
              : "Next"}
          </button>

          {state === "Login" ? (
            <p className="mt-5 text-center">
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setState("Sign Up")}
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p className="mt-5 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setState("Login")}
              >
                Login
              </span>
            </p>
          )}
          <img
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => setShowRecruiterLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </form>
      </div>
    </div>
  );
};

export default RecruiterLogin;
