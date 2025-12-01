import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { assets } from "../assets/assets";

/**
 * TrustedBy Component
 * Displays trusted companies logos in a professional slider using Swiper
 * Features autoplay, smooth transitions, and responsive design
 * No duplicate logos - uses Swiper's loop functionality for seamless scrolling
 */
const TrustedBy = () => {
  // Array of company logos with their details
  const companies = [
    { logo: assets.microsoft_logo, alt: "Microsoft" },
    { logo: assets.walmart_logo, alt: "Walmart" },
    { logo: assets.accenture_logo, alt: "Accenture" },
    { logo: assets.samsung_logo, alt: "Samsung" },
    { logo: assets.amazon_logo, alt: "Amazon" },
    { logo: assets.adobe_logo, alt: "Adobe" },
  ];

  // Duplicate companies multiple times to ensure seamless continuous scrolling
  const duplicatedCompanies = [...companies, ...companies, ...companies];

  return (
    <div className="border border-gray-200 shadow-md mx-0 sm:mx-2 mt-4 sm:mt-5 p-4 sm:p-6 rounded-lg bg-white overflow-hidden max-w-full relative z-10">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-8 xl:gap-12">
        {/* Professional Swiper Slider Container */}
        <div className="w-full sm:w-auto">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={50}
            slidesPerView="auto"
            freeMode={true}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              reverseDirection: true,
            }}
            loop={true}
            loopAdditionalSlides={companies.length}
            speed={5000}
            allowTouchMove={false}
            breakpoints={{
              320: {
                spaceBetween: 40,
              },
              640: {
                spaceBetween: 50,
              },
              1024: {
                spaceBetween: 60,
              },
              1280: {
                spaceBetween: 70,
              },
            }}
            className="trusted-by-swiper"
          >
            {duplicatedCompanies.map((company, index) => (
              <SwiperSlide key={index} className="!w-auto">
                <div className="flex items-center justify-center">
                  <img
                    className="h-6 sm:h-8 lg:h-10 xl:h-12 opacity-70 hover:opacity-100 transition-opacity duration-200"
                    src={company.logo}
                    alt={company.alt}
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;
