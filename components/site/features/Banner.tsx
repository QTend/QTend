import Link from 'next/link'
import React from 'react'

const Banner = () => {
  return (
    <div className=" bg-[#1A1A1A] mx-auto px-5 sm:px-6 lg:px-8 flex flex-col gap-32">
        <div className=" max-w-desktop p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden">
            
            <div className="flex-1 relative z-10 text-center md:text-left">
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
                    Everything you need is already included.
                </h3>
                <p className="text-[#F7F7F7] text-sm">
                    No add-ons. No limits. Start your free trial today.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto relative z-10">
                <Link href="/auth/sign-up" className="w-full sm:w-auto bg-[#F67D26] hover:bg-[#ea580c] text-white px-8 py-3.5 rounded-xl font-bold transition-colors text-center whitespace-nowrap shadow-lg shadow-orange-500/20">
                    Start Free Trial
                </Link>
                <button className="w-full sm:w-auto bg-transparent border border-[#E8E8E8] text-white hover:bg-gray-800 hover:border-gray-500 px-8 py-3.5 rounded-xl font-bold transition-colors text-center whitespace-nowrap">
                    Book a Demo
                </button>
            </div>
        </div>
    </div>
    
  )
}

export default Banner