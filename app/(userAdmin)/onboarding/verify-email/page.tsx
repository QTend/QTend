
'use client'

import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import { Mail } from 'lucide-react'
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
              <div className='bg-[#68A544] w-16 h-16 flex justify-center items-center rounded-xl mx-auto mb-3'>
                <Mail color='#ffffff' size={40} />
              </div>
                <h5 className='text-2xl font-medium text-center text-[#333333]' >Verify your email address</h5>
                <p className='text-center text-[#666666]'>We sent a code to the email, mybu...@gmail.com</p>
        
                <div className='mt-5 grid gap-2 mb-10'>
                    <label className='font-medium text-[#344054] text-sm'>Verification code</label>
                    <input 
                    type="text"
                    placeholder='Enter 6-digit code'
                    className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                    />
                </div>
        
                <GradientButton 
                  label='Verify and Continue' variant='gradient' 
                  onClick={handleVerification} className='w-full'
                />
        
                <p className='text-[#666666] text-xs text-center mt-3'>Didn't receive code? <span className='text-[#F67D26]'>Resend</span></p>
        
                
            </div>
    </section>
  )
}

export default page