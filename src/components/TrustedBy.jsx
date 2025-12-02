import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { assets } from "../assets/assets";
import "../styles/trusted.css";

/**
 * TrustedBy Component
 * Continuous infinite marquee slider (RTL) with smooth animation
 * Uses Swiper native loop + autoplay for seamless continuous scrolling
 * No manual reposition logic needed - Swiper handles everything
 */
const TrustedBy = () => {
  const companies = [
    { logo: assets.microsoft_logo, alt: "Microsoft" },
    { logo: assets.walmart_logo, alt: "Walmart" },
    { logo: assets.accenture_logo, alt: "Accenture" },
    { logo: assets.samsung_logo, alt: "Samsung" },
    { logo: assets.amazon_logo, alt: "Amazon" },
    { logo: assets.adobe_logo, alt: "Adobe" },
  ];

  return (
    <div className="border border-gray-200 shadow-md mx-0 sm:mx-2 mt-4 sm:mt-5 p-4 sm:p-6 rounded-lg bg-white overflow-hidden max-w-full">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={50}
        loop={true}
        speed={6000}
        allowTouchMove={false}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          reverseDirection: true,
        }}
        className="trusted-slider"
      >
        {companies.concat(companies).map((company, i) => (
          <SwiperSlide key={i} className="!w-auto">
            <img
              src={company.logo}
              alt={company.alt}
              className="h-6 sm:h-8 lg:h-10 xl:h-12 opacity-70 hover:opacity-100 transition-opacity duration-200"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrustedBy;
