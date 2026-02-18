'use client'
import React, { useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'

const categories = [
    'Resturnat',
    'Cafe',
    'Fast Food',
    'Bar',
    'Food Truck',
    'Bakery'
]

const About = () => {
    const [steps, setSteps] = useState('1');

  return (
     <div >
        <div className='bg-[#68A544] w-fit p-5 rounded-xl mx-auto mb-5'>
        <FaPhoneAlt color='#ffffff' size={24} />
        </div>
        <h5 className='text-2xl text-center font-medium' >Tell us about your business</h5>
        <p className='text-center text-black/80'>This helps us personalize your experience</p>

        <div className='mt-16 grid gap-2 mb-5'>
            <label htmlFor="" className='font-medium'>Business name</label>
            <input 
            type="text"
            placeholder='e.g Walmart'
            className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
            />
        </div>

        <div className='grid gap-2 mb-16'>
            <label htmlFor="" className='font-medium'>Business name</label>
            <select className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'>
                <option className='text-gray-500'>Select Category</option>
                {
                    categories.map((c, index) => (
                        <option key={index} value={c.toLocaleLowerCase()}>{c}</option>
                    ))
                }
            </select>
        </div>

        <div className='bg-orange-400  cursor-pointer text-white text-center p-3 rounded-xl'>
            Continue
        </div>
    </div>
  )
}

export default About