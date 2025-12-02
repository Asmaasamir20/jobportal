import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import { assets } from "../assets/assets";
import "../styles/trusted.css";

/**
 * TrustedBy Component
 * Continuous infinite marquee slider (RTL) with smooth animation
 * Uses Swiper native loop + autoplay for seamless continuous scrolling
 * Optimized for instant loading after reload - no delay in production
 *
 * Performance optimizations:
 * - Triple concat: More slides = faster loop initialization
 * - Reduced speed: Faster animation = less initialization delay
 * - loading="eager" on images: Load images immediately
 * - onInit callback: Ensure autoplay starts immediately after initialization
 * - waitForTransition: false in autoplay config to start immediately
 */
const TrustedBy = () => {
  const swiperRef = useRef(null);
  const companies = [
    { logo: assets.microsoft_logo, alt: "Microsoft" },
    { logo: assets.walmart_logo, alt: "Walmart" },
    { logo: assets.accenture_logo, alt: "Accenture" },
    { logo: assets.samsung_logo, alt: "Samsung" },
    { logo: assets.amazon_logo, alt: "Amazon" },
    { logo: assets.adobe_logo, alt: "Adobe" },
  ];

  // Multiply slides 3 times - optimal balance between loop stability and performance
  // مضاعفة السلايدز 3 مرات - توازن مثالي بين استقرار الـ loop والأداء
  // 3 repetitions (18 slides) is sufficient for loop mode with slidesPerView="auto"
  // 3 تكرارات (18 شريحة) كافية لوضع loop مع slidesPerView="auto"
  // More repetitions can cause performance issues on low-end devices
  // المزيد من التكرارات قد يسبب مشاكل أداء على الأجهزة الضعيفة
  const slides = [...companies, ...companies, ...companies];

  // Ensure autoplay starts immediately after Swiper initialization
  // التأكد من بدء التحريك فوراً بعد تهيئة Swiper
  // Event listeners removed - not needed since disableOnInteraction: false
  // تم إزالة مستمعي الأحداث - غير ضروريين لأن disableOnInteraction: false
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      const swiper = swiperRef.current.swiper;

      // Force autoplay to start immediately
      // بدء التحريك فوراً
      if (swiper.autoplay) {
        swiper.autoplay.start();
      }
    }
  }, []);

  return (
    <div className="border border-gray-200 shadow-md mx-0 sm:mx-2 mt-4 sm:mt-5 p-4 sm:p-6 rounded-lg bg-white overflow-hidden max-w-full">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={30}
        loop={true}
        watchSlidesProgress={true}
        loopPreventsSliding={false}
        speed={3000}
        allowTouchMove={false}
        onInit={(swiper) => {
          // Start autoplay immediately after initialization
          // بدء التحريك فوراً بعد التهيئة
          if (swiper.autoplay) {
            swiper.autoplay.start();
          }
        }}
        autoplay={{
          delay: 0,
          disableOnInteraction: false, // Don't stop on interaction
          pauseOnMouseEnter: false, // Don't pause on mouse hover
          reverseDirection: true,
          waitForTransition: false, // Start immediately without waiting
          stopOnLastSlide: false, // Don't stop on last slide
          stopOnInteraction: false, // Don't stop on any interaction
        }}
        className="trusted-slider"
      >
        {slides.map((company, i) => (
          <SwiperSlide key={i} className="!w-auto">
            <img
              src={company.logo}
              alt={company.alt}
              loading="eager"
              className="h-6 sm:h-8 lg:h-10 xl:h-12 opacity-70 hover:opacity-100 transition-opacity duration-200"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrustedBy;
