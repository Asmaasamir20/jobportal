import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { assets } from "../assets/assets";
import { useRef, useEffect } from "react";

/**
 * TrustedBy Component
 * Displays trusted companies logos in a professional slider using Swiper
 * Features autoplay, smooth transitions, and responsive design
 * Uses manual duplication for infinite scroll (loop mode disabled to prevent warnings)
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
  // Increased duplication to prevent Swiper loop warnings and ensure smooth infinite scroll
  const duplicatedCompanies = [
    ...companies,
    ...companies,
    ...companies,
    ...companies,
    ...companies,
  ];
  const swiperRef = useRef(null);

  // Initialize and ensure autoplay works correctly on mount and reload
  // Improved initialization to prevent glitches on reload
  useEffect(() => {
    let isInitialized = false;

    const initializeSwiper = () => {
      if (swiperRef.current?.swiper && !isInitialized) {
        const swiper = swiperRef.current.swiper;
        isInitialized = true;

        // Reset to middle position for seamless infinite scroll
        // Start from middle of duplicated slides to allow scrolling in both directions
        const middleIndex = Math.floor(duplicatedCompanies.length / 2);

        // Disable transitions temporarily for instant positioning on reload
        swiper.setTransition(0);
        swiper.slideTo(middleIndex, 0);

        // Re-enable transitions after positioning
        requestAnimationFrame(() => {
          swiper.setTransition(5000); // Match the speed value used in Swiper config

          // Ensure autoplay is properly initialized and running
          if (swiper.autoplay) {
            swiper.autoplay.stop();
            setTimeout(() => {
              swiper.autoplay.start();
              swiper.update();
            }, 50);
          }
        });
      }
    };

    // Initialize after component mount with shorter delay for faster startup
    const timer = setTimeout(initializeSwiper, 100);

    // Store ref value for cleanup to avoid linter warning
    const currentRef = swiperRef.current;

    return () => {
      clearTimeout(timer);
      isInitialized = false;
      // Cleanup on unmount
      if (currentRef?.swiper?.autoplay) {
        currentRef.swiper.autoplay.stop();
      }
    };
  }, [duplicatedCompanies.length]);

  return (
    <div className="border border-gray-200 shadow-md mx-0 sm:mx-2 mt-4 sm:mt-5 p-4 sm:p-6 rounded-lg bg-white overflow-hidden max-w-full relative z-10">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-8 xl:gap-12">
        {/* Professional Swiper Slider Container */}
        <div className="w-full sm:w-auto">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay]}
            spaceBetween={50}
            slidesPerView="auto"
            autoplay={{
              delay: 2, // Further reduced delay for faster, smoother movement
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              reverseDirection: true, // Reversed direction for consistent left-to-right visual flow
            }}
            // Disable loop mode since we're using manual duplication for infinite scroll
            // This prevents Swiper loop warnings while maintaining seamless scrolling
            loop={false}
            // Unified speed across all screen sizes for consistent animation
            // Further reduced speed value for faster movement while maintaining smoothness
            speed={5000}
            allowTouchMove={false}
            // Unified spaceBetween across all breakpoints for consistent movement
            breakpoints={{
              320: {
                spaceBetween: 50, // Same spacing on all screens
              },
              640: {
                spaceBetween: 50,
              },
              1024: {
                spaceBetween: 50,
              },
              1280: {
                spaceBetween: 50,
              },
            }}
            onSwiper={(swiper) => {
              // Swiper instance is ready - set to middle position for infinite scroll
              // Disable transition for instant positioning to prevent glitches
              const middleIndex = Math.floor(duplicatedCompanies.length / 2);
              swiper.setTransition(0);
              swiper.slideTo(middleIndex, 0);
              requestAnimationFrame(() => {
                swiper.setTransition(5000);
              });
            }}
            onInit={(swiper) => {
              // Initialize on first load - set to middle position for seamless infinite scroll
              // Disable transition for instant positioning to prevent glitches on reload
              const middleIndex = Math.floor(duplicatedCompanies.length / 2);
              swiper.setTransition(0);
              swiper.slideTo(middleIndex, 0);

              // Re-enable transitions and start autoplay after positioning
              requestAnimationFrame(() => {
                swiper.setTransition(5000);
                // Ensure autoplay starts after initialization
                setTimeout(() => {
                  if (swiper.autoplay) {
                    swiper.autoplay.start();
                  }
                }, 100);
              });
            }}
            onSlideChange={(swiper) => {
              // Handle infinite scroll: reset to middle when near edges
              // This ensures seamless continuous scrolling without visible jumps
              const currentIndex = swiper.activeIndex;
              const totalSlides = duplicatedCompanies.length;
              const middleIndex = Math.floor(totalSlides / 2);

              // Reset to middle when getting too close to the edges
              // This creates the illusion of infinite scroll
              if (
                currentIndex <= companies.length ||
                currentIndex >= totalSlides - companies.length
              ) {
                // Use requestAnimationFrame for smooth transition
                requestAnimationFrame(() => {
                  swiper.slideTo(middleIndex, 0);
                });
              }
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
