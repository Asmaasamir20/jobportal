import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

/**
 * Footer Component
 * Professional footer component with multiple sections and modern design
 * Includes: company info, quick links, contact us, and social media links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Quick links for the website
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Jobs', path: '/#jobs' },
    { name: 'Download App', path: '/#app-download' },
  ]

  // Useful links
  const usefulLinks = [
    { name: 'About Us', path: '/#about' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Contact Us', path: '/contact' },
  ]

  // Social media links with smooth hover effects
  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: assets.facebook_icon, 
      url: 'https://facebook.com',
      hoverColor: 'hover:bg-blue-500'
    },
    { 
      name: 'Twitter', 
      icon: assets.twitter_icon, 
      url: 'https://twitter.com',
      hoverColor: 'hover:bg-sky-500'
    },
    { 
      name: 'Instagram', 
      icon: assets.instagram_icon, 
      url: 'https://instagram.com',
      hoverColor: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500'
    },
  ]

  return (
    <footer className='bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 mt-12 sm:mt-20'>
      {/* Main Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
          
          {/* Company Info Section */}
          <div className='lg:col-span-1'>
            <div className='mb-6'>
              <img 
                className='h-10 sm:h-12 w-auto mb-4 transition-transform duration-300 hover:scale-105' 
                src={assets.logo} 
                alt="Logo" 
              />
              <p className='text-gray-600 text-sm sm:text-base leading-relaxed mb-4'>
                A professional platform for job searching, connecting job seekers with the best career opportunities across all industries.
              </p>
            </div>
            
            {/* Social Media Icons with Smooth Hover Effects */}
            <div className='flex gap-3'>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 
                    flex items-center justify-center 
                    rounded-full 
                    bg-gray-100 
                    ${social.hoverColor}
                    transition-all duration-300 ease-in-out
                    hover:scale-110
                    hover:shadow-lg
                    group
                  `}
                  aria-label={social.name}
                >
                  <img 
                    className='w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 group-hover:scale-110 group-hover:brightness-0 group-hover:invert' 
                    src={social.icon} 
                    alt={social.name} 
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className='text-gray-900 font-bold text-lg sm:text-xl mb-4 sm:mb-6'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className='
                      text-gray-600 
                      text-sm sm:text-base 
                      hover:text-blue-600 
                      transition-all duration-300 ease-in-out
                      inline-block
                      hover:translate-x-2
                    '
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Section */}
          <div>
            <h3 className='text-gray-900 font-bold text-lg sm:text-xl mb-4 sm:mb-6'>
              Useful Links
            </h3>
            <ul className='space-y-3'>
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className='
                      text-gray-600 
                      text-sm sm:text-base 
                      hover:text-blue-600 
                      transition-all duration-300 ease-in-out
                      inline-block
                      hover:translate-x-2
                    '
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h3 className='text-gray-900 font-bold text-lg sm:text-xl mb-4 sm:mb-6'>
              Contact Us
            </h3>
            <div className='space-y-4'>
              <div className='flex items-start gap-3 group cursor-pointer'>
                <div className='
                  w-10 h-10 
                  flex items-center justify-center 
                  rounded-lg 
                  bg-blue-100 
                  flex-shrink-0
                  group-hover:bg-blue-500
                  transition-all duration-300 ease-in-out
                  group-hover:scale-110
                '>
                  <img 
                    className='w-5 h-5 transition-all duration-300 group-hover:brightness-0 group-hover:invert' 
                    src={assets.email_icon} 
                    alt="Email" 
                  />
                </div>
                <div>
                  <p className='text-gray-500 text-xs sm:text-sm mb-1'>Email</p>
                  <a 
                    href='mailto:info@jobportal.com' 
                    className='text-gray-700 text-sm sm:text-base hover:text-blue-600 transition-colors duration-300'
                  >
                    info@jobportal.com
                  </a>
                </div>
              </div>
              
              <div className='flex items-start gap-3 group cursor-pointer'>
                <div className='
                  w-10 h-10 
                  flex items-center justify-center 
                  rounded-lg 
                  bg-blue-100 
                  flex-shrink-0
                  group-hover:bg-blue-500
                  transition-all duration-300 ease-in-out
                  group-hover:scale-110
                '>
                  <img 
                    className='w-5 h-5 transition-all duration-300 group-hover:brightness-0 group-hover:invert' 
                    src={assets.location_icon} 
                    alt="Location" 
                  />
                </div>
                <div>
                  <p className='text-gray-500 text-xs sm:text-sm mb-1'>Address</p>
                  <p className='text-gray-700 text-sm sm:text-base'>
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className='border-t border-gray-200 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='
            flex flex-col sm:flex-row 
            items-center justify-between 
            gap-4 
            text-sm sm:text-base 
            text-gray-600
          '>
            <p className='text-center sm:text-left'>
              © {currentYear} All rights reserved | 
              <span className='text-blue-600 font-semibold mx-1'>JobPortal</span>
            </p>
            <p className='text-center sm:text-right'>
              Designed by 
              <span className='text-blue-600 font-semibold mx-1'>Nandkishor Dhadhal</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer