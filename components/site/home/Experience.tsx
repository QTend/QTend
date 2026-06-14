


import React from 'react'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'

export const Experience = () => {
  return (
    <section className='p-16 bg-[#F67D26]'>
        <Header text="Ready to Modernize Your Ordering Experience?" color='#121212' />
        <DescHeader text='Join hospitality businesses using QTend to serve customers faster and
operate more efficiently.' color='#121212'/>

        <div className='flex items-center gap-3 w-fit mx-auto mt-6'>
            <div className="bg-black text-white font-medium text-sm rounded-lg py-2.5 px-4 cursor-pointer">
                Start Free
            </div>
            <div className="font-medium bg-transparent border border-[#121212] text-[#1D1D1F] text-sm rounded-lg py-2.5 px-4 cursor-pointer">
                Book a Demo
            </div>
        </div>

        <p className='text-xs text-[#4E4E4E] text-center mt-5'>No credit card required. 14-day free trial. Cancel anytime.</p>
    </section>
  )
}
