import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-4 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-4 py-4 sm:py-4 mt-12 sm:mt-20'>
        <img className='h-8 sm:h-auto max-w-[120px] sm:max-w-[160px]' src={assets.logo} alt="Logo" />
        <p className='flex-1 text-center sm:text-left border-l-0 sm:border-l border-gray-400 pl-0 sm:pl-4 text-xs sm:text-sm text-gray-500'>
          Copyright @NandkishorDhadhal | All right reserved.
        </p>
        <div className='flex gap-2 sm:gap-2.5'>
            <img className='w-8 h-8 sm:w-[38px] sm:h-[38px]' src={assets.facebook_icon} alt="Facebook" />
            <img className='w-8 h-8 sm:w-[38px] sm:h-[38px]' src={assets.twitter_icon} alt="Twitter" />
            <img className='w-8 h-8 sm:w-[38px] sm:h-[38px]' src={assets.instagram_icon} alt="Instagram" />
        </div>
    </div>
  )
}

export default Footer