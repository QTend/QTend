'use client'

import {AboutOne} from '@/components/userAdmin/screen/onboarding/AboutOne'
import { AboutThree } from '@/components/userAdmin/screen/onboarding/AboutThree'
import { AboutTwo } from '@/components/userAdmin/screen/onboarding/AboutTwo'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'





const page = () => {
  const [steps, setSteps] = useState('1');

  return (
    <section className='flex justify-center items-center h-screen'>
        <div className='bg-white p-6 min-w-125 max-h-screen overflow-auto rounded-lg 
  scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            <div className='flex justify-between mb-2'> 
            <p>Step {steps} of 3</p>
            <p>{steps === '1' && 33.3 || steps === '2' && 66.6 || steps === '3' && 100}%</p>
            </div>
            <div className='w-full h-2  bg-[#F47C2633] rounded-xl mb-6'>  
                <div 
                style={{width: `${steps === '1' && '33.3%' || steps === '2' && '66.6%' || steps === '3' && '100%'}`, height: '100%'}}
                className='bg-orange-400  '
                />
            </div>
            {steps === '1' && <AboutOne  setSteps={setSteps} /> }
            {steps === '2' && <AboutTwo setSteps={setSteps} /> }
            {steps === '3' && <AboutThree setSteps={setSteps} /> }
        </div>

        
         
    </section>
  )
}

export default page