
'use client'

import About from '@/components/userAdmin/screen/onboarding/About'
import { useRouter } from 'next/navigation'
import { FaPhoneAlt } from 'react-icons/fa'





const page = () => {
    const router = useRouter()

    const handleVerification = () => {
        router.push('/')
    }
  return (
    <section className='flex justify-center items-center h-screen'>
        <div className='bg-white p-6 min-w-125 rounded-lg'>
            <div className='flex justify-between mb-2'> 
            <p>Step 1 of 3</p>
            <p>33%</p>
        </div>
        <div className='w-full h-2  bg-[#F47C2633] rounded-xl mb-6'>  
            <div 
            style={{width: '30%', height: '100%'}}
            className='bg-orange-400  '
                />
        </div>
        <About />
        </div>
         
    </section>
  )
}

export default page