
'use client'

import Phone from '@/components/userAdmin/screen/Phone'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaPhoneAlt } from 'react-icons/fa'

const page = () => {
    const router = useRouter()

    const handleVerification = () => {
        router.push('/onboarding/about-business')
    }
  return (
    <section className='flex justify-center items-center h-screen'>
         <div className='bg-white p-6 min-w-125 rounded-lg'>
              <div className='bg-[#68A544] w-fit p-5 rounded-xl mx-auto mb-5'>
                <FaPhoneAlt color='#ffffff' size={24} />
              </div>
                <h5 className='text-2xl text-center' >Verify your phone number</h5>
                <p className='text-center text-black/80'>We sent a code to your phone</p>
        
                <div className='mt-16 grid gap-2 mb-16'>
                    <label htmlFor="" className='font-medium'>Verification code</label>
                    <input 
                    type="text"
                    placeholder='Enter 6-digit code'
                    className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                    />
                </div>
        
                <div onClick={handleVerification} className='bg-orange-400  cursor-pointer text-white text-center p-3 rounded-xl'>
                  Verify and Continue
                </div>
        
                <p className='text-black/70 text-xs text-center mt-3'>Didn't receive code? Resend</p>
        
                
            </div>
    </section>
  )
}

export default page