
'use client'

import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaPhoneAlt } from 'react-icons/fa'

const page = () => {
   const router = useRouter()

   const handleNext = () => {
    router.push('/onboarding/verify-phone')
   }
  
  return (
    <section className='flex justify-center items-center h-screen'>
         <div className='bg-white p-6 min-w-125 rounded-lg'>
              <div className='bg-[#68A544] w-fit p-5 rounded-xl mx-auto mb-5'>
                <FaPhoneAlt color='#ffffff' size={24} />
              </div>
                <h5 className='text-2xl text-center' >Create your account</h5>
                <p className='text-center text-black/80'>Enter your phone number to get started</p>
        
                <div className='mt-16 grid gap-2 mb-16'>
                    <label htmlFor="" className='font-medium'>Phone Number</label>
                    <input 
                    type="text"
                    placeholder='+234 800 000 0000'
                    className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                    />
                </div>
        
                <GradientButton 
                label='Send Verification Code' variant='gradient' 
                onClick={handleNext} className='w-full'
                 />

        
                <p className='text-black/70 text-xs text-center mt-3'>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        
                
            </div>
    </section>
  )
}

export default page