import React from 'react'
import { assets } from '../assets/assets'

const AppDownload = () => {
  return (
    <div className='px-4 sm:px-5 my-12 sm:my-20'>
        <div className='relative bg-gradient-to-r from-violet-50 to-purple-50 p-6 sm:p-12 lg:p-24 xl:p-32 rounded-lg overflow-hidden'> 
            <div className='relative z-10'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 sm:mb-8 max-w-md' >
              Download Mobile App For Better Experience
            </h1>
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                    <a href="#" className='inline-block'>
                        <img className='h-10 sm:h-12 w-auto' src={assets.play_store} alt="Google Play Store" />
                    </a>
                    <a href="#" className='inline-block'>
                        <img className='h-10 sm:h-12 w-auto' src={assets.app_store} alt="App Store" />
                    </a>
                </div>
            </div>
            <img className='absolute w-48 sm:w-64 lg:w-80 right-0 bottom-0 mr-0 sm:mr-8 lg:mr-32 max-lg:opacity-30 lg:opacity-100' src={assets.app_main_img} alt="Mobile App" />
        </div>
    </div>
  )
}

export default AppDownload