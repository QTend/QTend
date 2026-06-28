import React from 'react'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'
import Link from 'next/link'

export const Experience = () => {
  return (
    <section className='px-4 py-16 md:p-20 bg-[#F67D26]'>
        <div className="max-w-3xl mx-auto">
            <Header text="Ready to Modernize Your Ordering Experience?" color='#121212' />
            <DescHeader text='Join hospitality businesses using QTend to serve customers faster and operate more efficiently.' color='#121212'/>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-fit mx-auto mt-8'>
                <Link href={'/auth/sign-up'} className="bg-black text-white font-medium text-sm rounded-lg py-3.5 sm:py-3 px-6 w-full sm:w-auto text-center cursor-pointer hover:bg-gray-900 transition-colors">
                    Start Free
                </Link>
                <div className="font-medium bg-transparent border-2 border-[#121212] text-[#121212] text-sm rounded-lg py-3.5 sm:py-3 px-6 w-full sm:w-auto text-center cursor-pointer hover:bg-black/5 transition-colors">
                    Book a Demo
                </div>
            </div>

            <p className='text-xs text-[#121212]/80 font-medium text-center mt-6'>
                No credit card required. 14-day free trial. Cancel anytime.
            </p>
        </div>
    </section>
  )
}