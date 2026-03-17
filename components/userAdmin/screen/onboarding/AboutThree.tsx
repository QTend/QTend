'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import { PiCopyLight } from 'react-icons/pi'
import { GradientButton } from '../../ui/Buttons'

const categories = [
    'Resturnat',
    'Cafe',
    'Fast Food',
    'Bar',
    'Food Truck',
    'Bakery'
]

export const AboutThree = ({setSteps}: any) => {
    const router = useRouter()

    const handleContinue = () => {
        router.push('/kitchen/1/menu')
    }

  return (
     <div >
        <div className='bg-[#68A544] w-fit p-5 rounded-xl mx-auto mb-5'>
        <FaPhoneAlt color='#ffffff' size={24} />
        </div>
        <h5 className='text-2xl text-center font-medium' >Your menu URL is ready</h5>
        <p className='text-center text-black/80'>Share this link with your customers</p>

        <div className='text-center bg-[#F5F5F5] rounded-2xl p-3 mt-7'>
            <p className='text-sm'>Your menu will be available at</p>
            <p className='flex justify-center items-center gap-2 text-[#F47C26] font-semibold'>menu.qtend,app/resturnat <PiCopyLight color='#68A544' size={24} /></p>
        </div>

        <div className='border-[#FFD35A80] border-2 bg-[#FFD35A1A] mt-4 mb-10 p-3'>
            <h6 className='text-[#333333] mb-5'>🎉 What's next?</h6>

            <ul className="list-disc pl-5">
                <li>Add your first menu items</li>
                <li>Download your QR code</li>
                <li>Start accepting orders!</li>
            </ul>
        </div>


         <div className='flex justify-between gap-3'>
                     <GradientButton label='View QR code' variant='outline' onClick={() => setSteps('1')} className='w-full' />
                         <GradientButton label='Go to Dashboard' onClick={handleContinue} className='w-full' />
                 </div>
    </div>
  )
}