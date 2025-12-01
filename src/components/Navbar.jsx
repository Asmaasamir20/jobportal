import { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

/**
 * Navbar Component
 * شريط التنقل الرئيسي في الموقع مع animation للاختفاء والظهور عند السكرول
 */
const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  const { setShowRecruiterLogin, setShowAdminLogin } = useContext(AppContext);

  // State لتتبع حالة السكرول
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    /**
     * Handle scroll event
     * تختفي الـ Navbar عند السكرول لأسفل وتظهر عند السكرول لأعلى
     */
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // إذا كان المستخدم في أعلى الصفحة، أظهر الـ Navbar دائماً
      if (currentScrollY < 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // إذا كان السكرول لأسفل (أكثر من 100px) وأكبر من آخر موضع، أخفي الـ Navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      // إذا كان السكرول لأعلى، أظهر الـ Navbar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // إضافة event listener للسكرول
    window.addEventListener("scroll", handleScroll, { passive: true });

    // تنظيف event listener عند unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-3 sm:py-4 transition-transform duration-300 ease-in-out max-w-full overflow-x-hidden ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="px-4 sm:px-5 flex justify-between items-center gap-2 max-w-full">
        <img
          className="cursor-pointer h-8 sm:h-auto max-w-[120px] sm:max-w-none flex-shrink-0"
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
        />
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              to={"/applications"}
              className="text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap font-medium"
            >
              Applied Jobs
            </Link>
            <p className="text-gray-300 hidden sm:block">|</p>
            <p className="hidden sm:block text-sm sm:text-base text-gray-700 font-medium">
              Hi, {user.firstName + " " + user.lastName}
            </p>
            <div className="scale-90 sm:scale-100">
              <UserButton />
            </div>
          </div>
        ) : (
          <div className="flex gap-2 sm:gap-4 items-center flex-shrink-0">
            <button
              className="text-sm sm:text-base text-gray-600 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap font-medium"
              onClick={() => setShowRecruiterLogin(true)}
            >
              <span className="hidden sm:inline">Recruiter Login</span>
              <span className="sm:hidden">Recruiter</span>
            </button>
            <button
              className="text-sm sm:text-base text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin
            </button>
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-7 lg:px-10 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
